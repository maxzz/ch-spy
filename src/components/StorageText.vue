<template>
    <button  class="btn" @click="myStoredVariable.counter++">count is: {{ myStoredVariable.counter }}</button>
    <button class="btn" @click="myStoredVariable.counter = 0">reset count</button>

    <input class="text-gray-100 bg-purple-600" v-model="myStoredVariable.text">

    <button class="btn" @click="myStoredVariable.text = myStoredVariable.text + '-'">Text: {{myStoredVariable.text}}</button>
    <button class="btn" @click="myStoredVariable.text = ''">reset text</button>
</template>

<script lang="ts">
    import { useLocalStorage } from '@vueuse/core';
    export default {
        setup() {
            const myStoredVar = useLocalStorage('bop', { counter: 0, text: '' });

            return { myStoredVariable: myStoredVar };
        },
    };
</script>
