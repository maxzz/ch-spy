<template>
    <div class="bg-[#201c2b] min-h-screen">
        <div class="pl-2 py-4 bg-[#201c2b] font-bold text-2xl">
            <a href="https://coursehunter.net/course" target="blank">
                <span class="text-gray-100">course</span>
                <span class="text-[#944fff]">hunter</span>
            </a>
        </div>

        <div class="px-2 pt-4 bg-gray-300 max-w-3xl mx-auto h-full">
            <div class="flex">
                <input class="flex-1 input" v-model="sourceInput" placeholder="URL from coursehunter.net">
                <button class="btn" @click="onFetchDataClick">{{fetchBtnName}}</button>
                <button class="btn ml-1" @click="onClearStorageClick" title="Clear fetched data">Clear</button>
                <button class="btn ml-1" @click="onClearHTMLClick" v-if="storedToLocalStorage" title="Clear local storage">Clear HTML</button>
            </div>
            <div v-if="playerItemsUrl !== ''">
                <div class="flex text-sm mt-4 mb-1">
                    <a class="btn mr-1" :href="playerItemsUrl" target="_blank">
                        Get items from:
                    </a>
                    <input class="flex-1 px-2" readonly tabIndex="-1" v-model="playerItemsUrl">
                </div>
                <div class="flex">
                    <input
                        class="flex-1 input"
                        v-model="playerItemsJson" placeholder="Paste items from URL above">
                    <button
                        class="btn"
                        v-if="playerItemsJson" @click="onWebpageItemsParseClick"
                    >
                        Parse
                    </button>
                </div>
            </div>
            <GeneratedList :items="parsed.items" :title="parsed.title" :desc="parsed.desc"/>
            <ErrorMessage :value="errorMsg" @input="onClearErrorMsg" />
            <!-- <ErrorMessage :value="errorMsg" @input="onClearErrorMsg($event)" /> -->
            <!-- <ErrorMessage v-model="errorMsg" /> -->
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref, computed, watch, reactive, toRefs } from 'vue';
    import GeneratedList from './components/GeneratedList.vue';
    import ErrorMessage from './components/ErrorMessage.vue';
    import { parseHtmlToItems, getPlayerItemsUrl, parsePlayerItems } from './core/engine';

    const SAVED_HTML = 'coursehunters-items';
    const SAVED_SOURCE = 'coursehunters-source'; // url / html document / empty

    export default defineComponent({
        name: "App",
        components: { GeneratedList, ErrorMessage, },
        setup() {
            const sourceInput = ref('');

            const source = reactive({
                parsed: {
                    items: [],
                    title: '', 
                    desc: '',
                    source: '',
                }
            });

            const playerItemsUrl = ref('');
            const playerItemsJson = ref('');

            const isSourceInputUrl = computed(() => !!sourceInput.value.match(/^https?:\/\//));
            const fetchBtnName = computed(() => !sourceInput.value ? 'Type' : isSourceInputUrl.value ? 'Fetch' : 'Parse');
            const errorMsg = ref('');

            const storedToLocalStorage = ref(false);

            function applyNewHtml(html: string): void {
                source.parsed = parseHtmlToItems(html);

                if (source.parsed.items.length) {
                    playerItemsUrl.value = '';
                } else {
                    playerItemsUrl.value = getPlayerItemsUrl(html);
                }
            }

            const onClearErrorMsg = (newValue) => {
                errorMsg.value = newValue;
            }

            const onClearStorageClick = () => {
                sourceInput.value = '';
                source.parsed.items = [];
                source.parsed.title = '';
            };

            const onClearHTMLClick = () => {
                storedToLocalStorage.value = false;
                localStorage.removeItem(SAVED_HTML);
            }

            const onFetchDataClick = async () => {
                try {
                    let s = sourceInput.value;
                    if (s) {
                        let html = '';
                        
                        if (isSourceInputUrl.value) {
                            let res = await fetch(s);
                            html = await res.text();

                            localStorage.setItem(SAVED_HTML, html);
                            storedToLocalStorage.value = true;
                        } else {
                            html = s;

                            localStorage.setItem(SAVED_HTML, html);
                            storedToLocalStorage.value = true;
                        }

                        applyNewHtml(html);
                    } else {
                        errorMsg.value = `Type coursehuter.net course URL or paste html content from coursehuter.net`;
                    }
                } catch (error) {
                    errorMsg.value = `Error: ${error}`;
                }
            };

            const onWebpageItemsParseClick = () => {
                let res = parsePlayerItems(playerItemsJson.value);
                console.log(res)
                if (res.error) {
                    errorMsg.value = `Error: ${res.error}`;
                } else {
                    source.parsed.items = res.items;
                }
            };

            watch(() => sourceInput.value, () => {
                errorMsg.value = '';

                if (isSourceInputUrl.value) {
                    if (sourceInput.value) {
                        localStorage.setItem(SAVED_SOURCE, sourceInput.value);
                    } else {
                        localStorage.removeItem(SAVED_SOURCE);
                    }
                }
            });

            onMounted(() => {
                const checkStorage = () => {
                    let data = localStorage.getItem(SAVED_SOURCE);
                    if (data) {
                        sourceInput.value = data;
                    }

                    let html = localStorage.getItem(SAVED_HTML);
                    if (html) {
                        sourceInput.value = html;
                        storedToLocalStorage.value = true;
                        applyNewHtml(html);
                    }
                };

                checkStorage();
            });

            return {
                sourceInput,
                isSourceInputUrl,

                playerItemsUrl,
                playerItemsJson,

                ...toRefs(source),

                storedToLocalStorage,
                errorMsg,

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
