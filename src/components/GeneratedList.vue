<template>
    <div>CC {{title}} </div>
</template>

<script>
    import { ref } from "@vue/composition-api";
    //import html from '../assets/generated.html';
    require('../assets/generated.html')
    export default {
        setup() {
            const title = ref('title');
            return {
                title
            };
        }
    };
</script>

<style lang="scss" scoped>
</style>