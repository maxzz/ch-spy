<template>
    <div id="app">
        1
        <GeneratedList/>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import GeneratedList from './components/GeneratedList.vue';

    export default {
        name: "app",
        components: {
            GeneratedList
        },
        setup() {
            
        }
    } as any;
</script>

<style lang="scss">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
