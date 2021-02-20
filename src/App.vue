<template>
    <div id="app">
        <div class="controls">
            <input v-model="inputUrl" placeholder="URL from coursehunter.net">
            <button @click="onFetchDataClick">{{fetchBtnName}}</button>
            <button @click="onClearStorageClick" title="Clear fetched data">Clear</button>
            <!-- <button @click="onCopyHTMLClick" v-if="hasHTML" title="Copy HTML to clipboard">Copy HTML</button> -->
            <button @click="onClearHTMLClick" v-if="hasHTML" title="Clear local storage">Clear HTML</button>
        </div>

        <div v-if="webpageItemsLink">
            <div :style="{display: 'flex', margin: '1em .4em 0', fontSize: '.9em', padding: '.4em 0'}">
                <a :href="webpageItemsLink" target="_blank">Get items:</a>
                <input v-model="webpageItemsLink" :style="{flexGrow: '1', border: 'none', marginLeft: '.4em', outline: 'none'}" readonly tabindex="-1" >
            </div>
            <div class="controls">
                <input v-model="webpageItemsJson" placeholder="Paste items from URL above">
                <button v-if="webpageItemsJson" @click="onFetchAxiosItemsClick">Parse</button>
            </div>
        </div>

        <GeneratedList :items="webpageItems" :title="webpageTitle" :desc="webpageDesc"/>

        <ErrorMessage :value="errorMsg" @input="onClearErrorMsg" />
        <!-- <ErrorMessage :value="errorMsg" @input="onClearErrorMsg($event)" /> -->
        <!-- <ErrorMessage v-model="errorMsg" /> -->
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { onMounted, ref, computed, watch, defineComponent } from '@vue/composition-api';
    import GeneratedList from './components/GeneratedList.vue';
    import { htmlToItems, getAxiosItemsLink, parsePlayerItems, Item } from './engine';
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
            const webpageItemsLink = ref('');
            const webpageItemsJson = ref('');
            const webpageItems = ref<Item[]>([]);

            const isTypedUrl = computed(() => !!inputUrl.value.match(/^https?:\/\//));
            const fetchBtnName = computed(() => !inputUrl.value ? 'Type' : isTypedUrl.value ? 'Fetch' : 'Parse');
            const errorMsg = ref('');

            const hasHTML = ref(false);

            async function applyNewHtml(html: string): Promise<void> {
                const { items, title, desc, source } = htmlToItems(html);
                webpageTitle.value = title;
                webpageDesc.value = desc;
                webpageSource.value = source;
                webpageItems.value = items;

                if (!items.length) {
                    try {
                        webpageItemsLink.value = getAxiosItemsLink(html);
                    } catch (error) {
                        errorMsg.value = `Error: ${error}`;
                    }
                }
            }

            const checkStorage = async () => {
                let source = localStorage.getItem(SAVED_SOURCE);
                if (source) {
                    inputUrl.value = source;
                }

                let html = localStorage.getItem(SAVED_HTML);
                if (html) {
                    await applyNewHtml(html);
                    hasHTML.value = true;
                }
            };

            const onClearErrorMsg = (newValue) => {
                errorMsg.value = newValue;
            }

            const onClearStorageClick = () => {
                inputUrl.value = '';
                webpageItems.value = [];
                webpageTitle.value = '';
            };

            const onClearHTMLClick = () => {
                hasHTML.value = false;
                localStorage.removeItem(SAVED_HTML);
            }

            const onFetchDataClick = async () => {
                try {
                    let newUrl = inputUrl.value;
                    if (newUrl) {
                        let html = '';
                        if (isTypedUrl.value) {
                            let res = await fetch(newUrl);
                            html = await res.text();

                            localStorage.setItem(SAVED_HTML, html);
                            hasHTML.value = true;
                        } else {
                            html = newUrl;

                            localStorage.setItem(SAVED_HTML, html);
                            hasHTML.value = true;
                        }

                        await applyNewHtml(html);
                    } else {
                        errorMsg.value = `Type coursehuter.net course URL or paste html content from coursehuter.net`;
                    }
                } catch (error) {
                    errorMsg.value = `Error: ${error}`;
                }
            };

            const onWebpageItemsParseClick = () => {
                let res = parsePlayerItems(webpageItemsJson.value);
                if (res.error) {
                    errorMsg.value = `Error: ${res.error}`;
                } else {
                    webpageItems.value = res.items;
                }
            };

            watch(() => inputUrl.value, () => {
                errorMsg.value = '';

                if (isTypedUrl.value) {
                    if (inputUrl.value) {
                        localStorage.setItem(SAVED_SOURCE, inputUrl.value);
                    } else {
                        localStorage.removeItem(SAVED_SOURCE);
                    }
                }
            });

            onMounted(() => {
                checkStorage();
            });

            return {
                inputUrl,
                isTypedUrl,
                errorMsg,
                webpageItems,
                webpageTitle,
                webpageDesc,
                webpageItemsLink,
                webpageItemsJson,
                hasHTML,

                fetchBtnName,
                onFetchDataClick,
                onFetchAxiosItemsClick: onWebpageItemsParseClick,
                onClearStorageClick,
                onClearHTMLClick,
                onClearErrorMsg,
            }
        } //setup()
    });
</script>

<style lang="scss">
    * {
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;

        padding: 1rem .4rem .4rem;
    }

    button {
        padding: 1px 6px;
    }

    .controls {
        display: grid;
        grid-template-columns: 1fr repeat(3, auto);
        
        input {
            padding: .6em;
            border-top-left-radius: .4em;
            border: 1px solid #ddd;
        }
        button {
            user-select: none;
            margin-left: .2rem;
        }

        button:first-of-type {
            margin: 0;
        }
    }
</style>
