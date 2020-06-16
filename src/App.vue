<template>
    <div id="app">
        <div class="controls">
            <input type="text" v-model="inputUrl" placeholder="URL from coursehunter.net">
            <button @click="onFetchDataClick">{{fetchBtnName}}</button>
            <button @click="onClearStorageClick">Clear</button>
        </div>
        <GeneratedList :items="webpageItems" :title="webpageTitle"/>

        <ErrorMessage v-model="errorMsg"></ErrorMessage>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { onMounted, ref, computed, watch, defineComponent } from '@vue/composition-api';
    import GeneratedList from './components/GeneratedList.vue';
    import { htmlToItems, Item } from './engine';
    import ErrorMessage from './components/ErrorMessage.vue';

    const SAVED_HTML = 'coursehunters-items';
    const SAVED_SOURCE = 'coursehunters-source'; // url / html document / empty

    export default defineComponent({
        name: "app",
        components: {
            GeneratedList,
            ErrorMessage,
        },
        setup() {
            const inputUrl = ref('');

            const webpageTitle = ref('');
            const webpageDesc = ref('');
            const webpageSource = ref('');
            const webpageItems = ref<Item[]>([]);

            function applyNewHtml(html: string): void {
                const { items, title, desc, source } = htmlToItems(html);
                webpageTitle.value = title;
                webpageDesc.value = desc;
                webpageSource.value = source;
                webpageItems.value = items;
            }

            const checkStorage = () => {
                let source = localStorage.getItem(SAVED_SOURCE);
                if (source) {
                    inputUrl.value = source;
                }
                let html = localStorage.getItem(SAVED_HTML);
                if (html) {
                    applyNewHtml(html);
                }
            };

            const onClearStorageClick = () => {
                localStorage.removeItem(SAVED_HTML);
                webpageItems.value = [];
                webpageTitle.value = '';
            };

            function isUrl(v: string): boolean {
                return v.lastIndexOf('https:', 0) !== -1;
            }

            const errorMsg = ref('');

            const onFetchDataClick = async () => {
                try {
                    let newUrl = inputUrl.value;
                    if (newUrl) {
                        let html = '';
                        if (isUrl(newUrl)) {
                            let res = await fetch(newUrl);
                            html = await res.text();
                            localStorage.setItem(SAVED_HTML, html);
                        } else {
                            html = newUrl;
                            localStorage.removeItem(SAVED_HTML);
                        }

                        applyNewHtml(html);
                    }
                } catch (error) {
                    errorMsg.value = `Error: ${error}`;
                }
            };

            watch(() => inputUrl.value, () => {
                console.log('saved');
                errorMsg.value = '';
                localStorage.setItem(SAVED_SOURCE, inputUrl.value);
            });

            const fetchBtnName = computed(() => !inputUrl.value ? 'Type' : isUrl(inputUrl.value) ? 'Fetch' : 'Parse');

            onMounted(() => {
                console.log('mounted');
                checkStorage();
            });

            return {
                inputUrl,
                errorMsg,
                webpageItems,
                webpageTitle,

                fetchBtnName,
                onFetchDataClick,
                onClearStorageClick,
            }
        } //setup()
    });
</script>

<style lang="scss">
    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
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
