<template>
    <div id="app" class="px-2 pt-4 bg-gray-300 max-w-3xl mx-auto min-h-screen">
        <div class="flex">
            <input class="flex-1 input" v-model="inputUrl" placeholder="URL from coursehunter.net">

            <button class="btn" @click="onFetchDataClick">{{fetchBtnName}}</button>
            <button class="btn ml-1" @click="onClearStorageClick" title="Clear fetched data">Clear</button>
            <button class="btn ml-1" @click="onClearHTMLClick" v-if="hasHTML" title="Clear local storage">Clear HTML</button>
        </div>

        <div v-if="webpageItemsJsonUrl !== ''">
            <div class="flex text-sm mt-4 mb-1">
                <a class="btn mr-1" :href="webpageItemsJsonUrl" target="_blank">
                    Get items from:
                </a>
                <input class="flex-1 px-2" readonly tabIndex="-1" v-model="webpageItemsJsonUrl">
            </div>

            <div class="flex">
                <input
                    class="flex-1 input"
                    v-model="webpageItemsJson" placeholder="Paste items from URL above">
                <button 
                    class="btn"
                    v-if="webpageItemsJson" @click="onWebpageItemsParseClick"
                >
                    Parse
                </button>
            </div>
        </div>

        <GeneratedList :items="data.items" :title="data.title" :desc="data.desc"/>
        <!-- <GeneratedList :items="webpageItems" :title="webpageTitle" :desc="webpageDesc"/> -->

        <ErrorMessage :value="errorMsg" @input="onClearErrorMsg" />
        <!-- <ErrorMessage :value="errorMsg" @input="onClearErrorMsg($event)" /> -->
        <!-- <ErrorMessage v-model="errorMsg" /> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref, computed, watch, reactive, toRef, toRefs } from 'vue';
    import GeneratedList from './components/GeneratedList.vue';
    import ErrorMessage from './components/ErrorMessage.vue';
    import { htmlToItems, getAxiosItemsLink, parsePlayerItems, Item, ParseResult } from './core/engine';
import { log } from 'node:console';

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

            const source = reactive({
                data: {
                    items: [],
                    title: '', 
                    desc: '',
                    source: '',
                }
            });

            // const webpageTitle = ref('');
            // const webpageDesc = ref('');
            // const webpageSource = ref('');
            // const webpageItems = ref<Item[]>([]);

            const webpageItemsJsonUrl = ref('');
            const webpageItemsJson = ref('');

            const isTypedUrl = computed(() => !!inputUrl.value.match(/^https?:\/\//));
            const fetchBtnName = computed(() => !inputUrl.value ? 'Type' : isTypedUrl.value ? 'Fetch' : 'Parse');
            const errorMsg = ref('');

            const hasHTML = ref(false);

            async function applyNewHtml(html: string): Promise<void> {
                source.data = htmlToItems(html);
                // const { items, title, desc, source } = htmlToItems(html);
                // webpageTitle.value = title;
                // webpageDesc.value = desc;
                // webpageSource.value = source;
                // webpageItems.value = items;

                if (!source.data.items.length) {
                    try {
                        webpageItemsJsonUrl.value = getAxiosItemsLink(html);
                    } catch (error) {
                        errorMsg.value = `Error: ${error}`;
                    }
                }
            }

            const checkStorage = async () => {
                let data = localStorage.getItem(SAVED_SOURCE);
                if (data) {
                    inputUrl.value = data;
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
                source.data.items = [];
                source.data.title = '';
                // webpageItems.value = [];
                // webpageTitle.value = '';
            };

            const onClearHTMLClick = () => {
                hasHTML.value = false;
                localStorage.removeItem(SAVED_HTML);
            }

            /*
            const titleText = computed(() => {
                // ru + eng + description
                return 
            });
            */

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
                console.log(res)
                if (res.error) {
                    errorMsg.value = `Error: ${res.error}`;
                } else {
                    // webpageItems.value = res.items;
                    source.data.items = res.items;
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

                ...toRefs(source),
                // webpageItems,
                // webpageTitle,
                // webpageDesc,

                webpageItemsJsonUrl,
                webpageItemsJson,
                hasHTML,

                fetchBtnName,
                onFetchDataClick,
                onWebpageItemsParseClick,
                onClearStorageClick,
                onClearHTMLClick,
                onClearErrorMsg,
            }
        } //setup()
    });
</script>
