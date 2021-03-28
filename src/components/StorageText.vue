<template>
    <button  class="btn" @click="myStoredVariable++">count is: {{ myStoredVariable }}</button>
    <button class="btn" @click="myStoredVariable = 0">reset count</button>
</template>

<script lang="ts">
    import { ref } from 'vue';
    import { useLocalStorage } from '@vueuse/core';
    export default {
        setup(props) {
            const myStoredVariable = useLocalStorage('bop', 0);
            return { myStoredVariable };
        },
    };
</script>
