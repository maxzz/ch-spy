<template>
    <div id="app">
        <div class="controls">
            <input type="text" v-model="urlInput" placeholder="URL from courcehunter.net">
            <button @click="fetchData">{{buttonName}}</button>
            <button @click="clearStorage">Clear</button>
        </div>
        <GeneratedList :items="items" :title="title"/>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { onMounted, ref, computed, watch } from '@vue/composition-api';
    import GeneratedList from './components/GeneratedList.vue';
    import { htmlToItems } from './engine';

    const SAVED_HTML = 'coursehunters-items';
    const SAVED_SOURCE = 'coursehunters-source'; // url / html document / empty

    export default {
        name: "app",
        components: {
            GeneratedList
        },
        setup() {
            let urlInput = ref('https://coursehunter.net/course/sozdavayte-igry-v-realnom-vremeni-s-node-js');

            let items = ref([]);
            let title = ref('');

            const checkStorage = () => {
                let source = localStorage.getItem(SAVED_SOURCE);
                if (source) {
                    urlInput.value = source;
                }
                let html = localStorage.getItem(SAVED_HTML);
                if (html) {
                    let parced = htmlToItems(html);
                    items.value = parced.items;
                    title.value = parced.title;
                }
            };

            const clearStorage = () => {
                localStorage.removeItem(SAVED_HTML);
                items.value = [];
                title.value = '';
            };

            function isUrl(v: string): boolean {
                return v.lastIndexOf('https:', 0) !== -1;
            }

            const fetchData = async () => {
                try {
                    if (urlInput.value) {
                        let html = '';
                        if (isUrl(urlInput.value)) {
                            let res = await fetch(urlInput.value);
                            html = await res.text();
                            localStorage.setItem(SAVED_HTML, html);
                        } else {
                            html = urlInput.value;
                            localStorage.removeItem(SAVED_HTML);
                        }

                        let parced = htmlToItems(html); 
                        items.value = parced.items;
                        title.value = parced.title;
                    }
                } catch (err) {
                    alert(`Error: ${err}`);
                }
            };

            watch(() => localStorage.setItem(SAVED_SOURCE, urlInput.value));

            const buttonName = computed(() => !urlInput.value ? 'Type' : isUrl(urlInput.value) ? 'Fetch' : 'Parse');

            onMounted(() => {
                checkStorage();
            });

            return {
                urlInput,
                items,
                title,
                buttonName,
                fetchData,
                clearStorage,
            }
        }
    } as any;
</script>

<style lang="scss">
    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        //text-align: center;
        color: #2c3e50;
        //margin-top: 60px;
    }

    .controls {
        display: grid;
        grid-template-columns: 1fr min-content min-content;

        input {
            padding: .6em;
            border-top-left-radius: .4em;
            border: 1px solid #ddd;
        }
        button {
            user-select: none;
        }
    }
</style>
