<template>
    <button  class="btn" @click="myStoredVariable.counter++">count is: {{ myStoredVariable.counter }}</button>
    <button class="btn" @click="myStoredVariable.counter = 0">reset count</button>
    <button class="btn" @click="myStoredVariable.counter2 = myStoredVariable.counter2 + '-'">Text: {{myStoredVariable.counter2}}</button>
    <button class="btn" @click="myStoredVariable.counter2 = ''">reset text</button>
</template>

<script lang="ts">
    import { useLocalStorage } from '@vueuse/core';
    export default {
        setup() {
            const myStoredVariable = useLocalStorage('bop', { counter: 0, counter2: 'abc' });

            return { myStoredVariable };
        },
    };
</script>
