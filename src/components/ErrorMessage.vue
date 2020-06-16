<template>
    <div v-if="errorMsg" class="error-msg">
        <span>Error message{{errorMsg}}</span>
        <button @click="onErrorClear" tabindex="-1">&times;</button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, ref } from '@vue/composition-api';

    export default defineComponent({
        props: ['value'],
        setup(props: { value: string }, { emit }) {

            const errorMsg = ref(props.value);

            let timeoutID;

            watch(() => props.value, () => {
                errorMsg.value = props.value;

                if (errorMsg.value) {
                    timeoutID && clearTimeout(timeoutID);
                    timeoutID = setTimeout(() => onErrorClear(), 5000);
                }
            })

            function onErrorClear() {
                emit('input', '');
            }

            return {
                errorMsg,
                onErrorClear,
            };
        }
    });
</script>

<style lang="scss" scoped>
    .error-msg {
        margin-top: 1rem;
        padding: .6rem;
        background-color: red;
        display: flex;
        align-items: center;

        span {
            color: white;
            flex-grow: 1;
        }

        button {
            width: 1.6rem;
            outline: none;
            display: flex;
            justify-content: center;
        }
    }
</style>
