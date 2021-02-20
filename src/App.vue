<template>
    <div id="app">
        <div class="controls">
            <input type="text" v-model="inputUrl" placeholder="URL from coursehunter.net">
            <button @click="onFetchDataClick">{{fetchBtnName}}</button>
            <button @click="onClearStorageClick" title="Clear fetched data">Clear</button>
            <!-- <button @click="onCopyHTMLClick" v-if="hasHTML" title="Copy HTML to clipboard">Copy HTML</button> -->
            <button @click="onClearHTMLClick" v-if="hasHTML" title="Clear local storage">Clear HTML</button>
        </div>

        <div v-if="webpageItemsLink">
            <div>No Items</div>
            <div class="controls">
                <input type="text" v-model="webpageItemsLink" placeholder="URL to get items">
                <button @click="onFetchAxiosItemsClick">Get Links</button>
            </div>
        </div>

        <GeneratedList :items="webpageItems" :title="webpageTitle" :desc="webpageDesc"/>

        <ErrorMessage :value="errorMsg" @input="onClearErrorMsg()" />
        <!-- <ErrorMessage v-model="errorMsg" /> -->
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { onMounted, ref, computed, watch, defineComponent } from '@vue/composition-api';
    import GeneratedList from './components/GeneratedList.vue';
    import { htmlToItems, getAxiosItemsLink, fetchAxiosItems, Item } from './engine';
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
            const webpageItems = ref<Item[]>([]);

            const isTypedUrl = computed(() => !!inputUrl.value.match(/^https?:\/\//));
            const fetchBtnName = computed(() => !inputUrl.value ? 'Type' : isTypedUrl.value ? 'Fetch' : 'Parse');
            const errorMsg = ref('');

            const onClearErrorMsg = () => {
                console.log('aa', arguments);
                errorMsg.value = '';
            }

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
                    if (webpageItemsLink.value) {
                        await fetchAxiosItems(webpageItemsLink.value);
                    }
                    } catch (error) {
                        errorMsg.value = error.ErrorMessage;
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

            const onFetchAxiosItemsClick = async () => {

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
                hasHTML,

                fetchBtnName,
                onFetchDataClick,
                onFetchAxiosItemsClick,
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
