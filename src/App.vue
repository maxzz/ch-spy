<template>
    <div class="bg-[#201c2b] min-h-screen">
        <!-- Row Logo -->
        <div class="pl-2 py-4 font-bold text-2xl bg-[#201c2b]">
            <a href="https://coursehunter.net/course" target="_blank">
                <span class="text-gray-100">course</span>
                <span class="text-[#944fff]">hunter</span>
            </a>
        </div>

        <!-- <button class="btn" @click="onDownloadFilesClcik">Download</button> -->

        <div class="px-2 py-4 mx-auto max-w-3xl bg-gray-300">
            <!-- Row 1 -->
            <div class="flex">
                <!-- HTML input -->
                <div class="flex flex-1 overflow-hidden rounded-sm focus-within:ring-2 ring-offset-2 ring-purple-600 ring-offset-gray-200">
                    <input 
                        class="flex-1 input border border-gray-600 outline-none" 
                        :class="[sourceInput ? 'border-r-0' : 'border']"
                        v-model="sourceInput" 
                        placeholder="URL or HTML from coursehunter.net"
                        spellcheck="false"
                        @keypress.enter="sourceInput && onParseOrFetchHtmlClick()"
                    >
                    <button 
                        class="
                            btn
                            transition-transform
                            border-l-0 rounded-tl-none rounded-bl-none active:rounded-sm active:border"
                        :class="[sourceInput ? '-ml-4' : 'px-0 w-0 border-none transform -translate-x-6']"
                        @click="onParseOrFetchHtmlClick"
                        :tabindex="-1"
                    >
                        {{fetchBtnName}}
                    </button>
                </div>
                <!-- Clear buttons -->
                <button class="btn ml-2" @click="onClearStorageClick" title="Clear fetched data">Clear</button>
                <button class="btn ml-1" @click="onClearHTMLClick" v-if="storedToLocalStorage" title="Clear local storage">Clear HTML</button>
            </div>

            <!-- Row 2 -->
            <div v-if="playerItemsUrl !== ''"> <!-- <div v-if="playerItemsUrl !== '' && !parsed.items.length"> --> <!-- < - This is how it should be in production -->
                <div :class="[!parsed.items.length ? '' : 'transform scale-50' ]">
                    <!-- Get player items URL -->
                    <div class="flex text-sm mt-4 mb-1">
                        <a class="btn text-xs mr-1" :href="playerItemsUrl" target="_blank">
                            Get items from:
                        </a>
                        <a class="flex text-xs items-center underline" :href="playerItemsUrl" target="_blank">
                            {{playerItemsUrl}}
                        </a>
                        <!-- <a :href="playerItemsUrl" target="_blank">
                            <input class="flex-1 px-2 text-xs bg-gray-300 underline" readonly tabIndex="-1" v-model="playerItemsUrl">
                        </a> -->
                    </div>
                    <!-- Parse player items -->
                    <div class="flex">
                        <input class="flex-1 input" v-model="playerItemsJson" placeholder="Copy and paste items from url above">
                        <button class="btn" v-if="playerItemsJson" @click="onParsePlayerItemsClick">
                            Parse
                        </button>
                    </div>
                </div>
            </div>

            <!-- Row 3 -->
            <GeneratedList :items="parsed.items" :title="parsed.title" :desc="parsed.desc" @save-files="onSavePersistentFileClick"/>

            <!-- Row 4 -->
            <ErrorMessage :value="errorMsg" @input="onClearErrorMsg" />
            <!-- <ErrorMessage :value="errorMsg" @input="onClearErrorMsg($event)" /> -->
            <!-- <ErrorMessage v-model="errorMsg" /> -->

            <!-- Hidden text -->
            <div hidden>{{sourceInput}}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref, computed, watch, reactive, toRefs } from 'vue';
    import GeneratedList, { EventSaveFiles } from './components/GeneratedList.vue';
    import ErrorMessage from './components/ErrorMessage.vue';
    import { parseHtmlToItems, getPlayerItemsUrl, parsePlayerItems, downloadFile, generatePersistentFileContent } from './core/engine';

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
            const fetchBtnName = computed(() => !sourceInput.value ? '' : isSourceInputUrl.value ? 'Fetch' : 'Parse');
            const errorMsg = ref('');

            const storedToLocalStorage = ref(false);

            function parseAndApplyNewHtml(html: string): void {
                source.parsed = parseHtmlToItems(html);

                if (source.parsed.items.length) {
                    playerItemsUrl.value = '';
                } else {
                    playerItemsUrl.value = getPlayerItemsUrl(html);
                    errorMsg.value = playerItemsUrl.value !== '' ? '' : 'Nothing detected';
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

            const onParseOrFetchHtmlClick = async () => {
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

                        parseAndApplyNewHtml(html);
                    } else {
                        errorMsg.value = `Type coursehuter.net course URL or paste html content from coursehuter.net`;
                    }
                } catch (error) {
                    errorMsg.value = `Error: ${error}`;
                }
            };

            const onParsePlayerItemsClick = () => {
                let res = parsePlayerItems(playerItemsJson.value);
                //console.log(res);
                if (res.error) {
                    errorMsg.value = `${res.error}`;
                    source.parsed.items = [];
                } else {
                    source.parsed.items = res.items;
                }
            };

            // async function onDownloadFilesClcik() {
            // }

            async function onSavePersistentFileClick(payload: EventSaveFiles) {
                let persistent = generatePersistentFileContent(payload.itemsList, sourceInput.value);
                await downloadFile(new Blob([payload.rename], {type : 'application/json'}), 'rename.cmd.txt');
                await downloadFile(new Blob([persistent], {type : 'text/plain'}), 'page-sourse.txt');
                // TODO: show error; implement downloadFiles([])
            }

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
                        parseAndApplyNewHtml(html);
                    }
                };

                checkStorage();
            });

            return {
                sourceInput,

                playerItemsUrl,
                playerItemsJson,

                ...toRefs(source),

                storedToLocalStorage,
                errorMsg,

                fetchBtnName,
                onParseOrFetchHtmlClick,
                onParsePlayerItemsClick,
                onClearStorageClick,
                onClearHTMLClick,
                onClearErrorMsg,
                // onDownloadFilesClcik,
                onSavePersistentFileClick,
            }
        } //setup()
    });
</script>
