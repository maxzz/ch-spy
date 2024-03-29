<template>
    <div class="bg-[#201c2b] min-h-screen" @dragenter="on_dragenter" @dragleave="on_dragleave" @dragover="on_dragover" @drop="on_drop">
        <!-- Row Logo -->
        <div class="flex justify-between items-center">
            <div :class="`pl-2 py-4 font-bold text-2xl bg-[#201c2b] cutom-cursor`">
                <a href="https://coursehunter.net" target="_blank">
                    <span :class="` ${dragActive ? 'text-green-400' : 'text-gray-100'}`">course</span>
                    <span :class="` ${dragActive ? 'text-green-400' : 'text-[#944fff]'}`">hunter</span>
                </a>
            </div>
            <div class="flex">
                <div class="mr-2 w-6 h-6 relative text-gray-400 self-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" @click="showRawInfo = !showRawInfo">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                    <div class="absolute top-8 -right-32 border rounded-sm bg-gray-800 text-gray-400 text-xs font-mono z-20 cursor-default" v-if="showRawInfo">
                        <div class="max-w-xs max-h-96 overflow-auto smallscroll">
                            <pre>{{JSON.stringify(parsed.info.raw, null, 2)}}</pre>
                        </div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div class="px-1 grid grid-flow-row grid-cols-2 gap-x-1 text-gray-400 text-xs">
                        <div class="text-right">Published:</div>
                        <div>{{parsed.info.raw.datePublished}}</div>
                        <div class="text-right">Modified:</div>
                        <div>{{parsed.info.raw.dateModified}}</div>
                        <div class="text-right">Duration:</div>
                        <div>{{parsed.info.duration}}</div>
                    </div>
                    <span><a v-if="parsed.info.preview" :href="parsed.info.site" target="_blank"><img class="max-h-14 mr-2" :src="parsed.info.preview" alt="course logo"></a></span>
                </div>
            </div>
        </div>

        <!-- <button class="btn" @click="onDownloadFilesClcik">Download</button> -->

        <div class="px-2 py-4 mx-auto max-w-3xl bg-gray-300">
            <!-- Row 1 -->
            <div class="flex" :class="[!playerItemsUrl && parsed.items.length ? 'mb-1' : '']">
                <!-- Clear button flex-direction: row-reverse;-->
                <!-- v-if="sourceInput"  -->
                <button
                    class="btn mr-2 transition-transform transform"
                    :class="[sourceInput || parsed.items.length ? '' : 'scale-x-0']"
                    @click="onClearStorageClick" title="Clear fetched data. Ctrl+Click clear player items as well"
                    ref="clearBtnElement"
                >
                    Clear
                </button>
                <!-- HTML input -->
                <div class="flex flex-1 overflow-hidden rounded-sm focus-within:ring-2 ring-offset-2 ring-purple-600 ring-offset-gray-200">
                    <input
                        class="flex-1 input border border-gray-600 outline-none text-xs"
                        :class="[sourceInput ? 'border-r-0' : 'border']"
                        v-model="sourceInput"
                        placeholder="URL or HTML from coursehunter.net"
                        spellcheck="false"
                        @keypress.enter="sourceInput && onParseOrFetchHtmlClick()"
                    >
                    <!-- Parse / Fetch button -->
                    <button
                        class="btn transition-transform rounded-l-none active:rounded-sm active:border focus:ring-0 focus:shadow-none"
                        :class="[sourceInput ? '-ml-4' : 'px-0 w-0 border-none transform -translate-x-6']"
                        @click="onParseOrFetchHtmlClick"
                        :tabindex="-1"
                    >
                        {{fetchBtnName}}
                    </button>
                </div>
            </div>

            <!-- Row 2: Get items -->
            <div v-if="playerItemsUrl !== ''">
                <div
                    class="transition-transform duration-1000"
                    :class="[!parsed.items.length ? '' : 'transform -translate-x-28 -translate-y-6 scale-50' ]"
                >
                    <!-- Get player items URL -->
                    <div class="flex text-sm mt-4 mb-2">
                        <a class="btn text-xs mr-1" :href="playerItemsUrl" target="_blank">
                            Get items from:
                        </a>
                        <button class="btn text-xs ml-0.5 mr-1.5" @click="onClearPlayItemsClick">Clear</button>
                        <a class="flex text-xs items-center underline" :href="playerItemsUrl" target="_blank">
                            {{playerItemsUrl}}
                        </a>
                    </div>
                    <!-- Parse player items -->
                    <div class="flex">
                        <input
                            class="flex-1 input text-xs outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 focus:ring-offset-gray-200"
                            v-model="playerItemsJson"
                            placeholder="Copy and paste items from url above"
                            spellcheck="false"
                            @keypress.enter="onParsePlayerItemsClick"
                        >
                        <button class="btn ml-1.5" v-if="playerItemsJson" @click="onParsePlayerItemsClick">
                            Parse
                        </button> <!-- TODO: clear, copy -->
                    </div>
                </div>
            </div>

            <!-- Row 3: Parse items and show list -->
            <div :class="[playerItemsUrl && parsed.items.length ? '-mt-8' : '']">
                <GeneratedList :items="parsed.items" :title="parsed.info.title" :desc="parsed.info.desc" @save-files="onSavePersistentFileClick"/>
            </div>

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
    import { useLocalStorage } from '@vueuse/core';
    import GeneratedList, { EventSaveFiles } from './components/GeneratedList.vue';
    import ErrorMessage from './components/ErrorMessage.vue';
    import { parseHtmlToItems, getPlayerItemsUrl, parsePlayerItems, generatePersistentFileContent, ParseResult, parsePersistentFileContent } from './core/engine';
    import { downloadFile, textFileReader } from './utils/utils';

    const LOCALSTORAGE_HTML = 'ch-spy-html';
    const LOCALSTORAGE_PLAYERITEMS = 'ch-spy-playeritems';

    type CopiedState = {
        a: 'tm';            // marker
        docurl: string;
        itemsurl: string;
        doc: string;        // document.documentElement.outerHTML
        items: string;      // fetched items
    }

    export default defineComponent({
        name: "App",
        components: { GeneratedList, ErrorMessage, },
        setup() {
            const sourceInput = useLocalStorage(LOCALSTORAGE_HTML, '');
            const playerItemsJson = useLocalStorage(LOCALSTORAGE_PLAYERITEMS, '');
            const playerItemsUrl = ref('');

            const source = reactive<{parsed: ParseResult}>({
                parsed: {
                    items: [],
                    info: {
                        raw: {}
                    },
                }
            });

            const isSourceInputUrl = computed(() => !!sourceInput.value.match(/^https?:\/\//));
            const fetchBtnName = computed(() => !sourceInput.value ? '' : isSourceInputUrl.value ? 'Fetch' : 'Parse');
            const errorMsg = ref('');
            const showRawInfo = ref(false);
            const clearBtnElement = ref<HTMLElement>();

            function parseAndApplyNewHtml(html: string): void {
                source.parsed = parseHtmlToItems(html);

                if (source.parsed.items.length) {
                    playerItemsUrl.value = '';
                } else {
                    playerItemsUrl.value = getPlayerItemsUrl(html);
                    errorMsg.value = playerItemsUrl.value !== '' ? '' : 'Nothing detected';
                }
            }

            const onParseOrFetchHtmlClick = async () => {
                try {
                    let s = sourceInput.value;
                    if (s) {
                        let html = '';

                        if (sourceInput.value.match(/^{"a":"tm","docurl":"/)) {
                            try {
                                let data = JSON.parse(sourceInput.value) as CopiedState;
                                html = data.doc;
                                source.parsed = parseHtmlToItems(html);
                                playerItemsUrl.value = data.itemsurl;
                                playerItemsJson.value = data.items;
                                onParsePlayerItemsClick();
                                clearBtnElement.value.focus();
                                return;
                            } catch (error) {
                                console.error('Cannot parse pasted input.');
                            }
                        }

                        if (isSourceInputUrl.value) {
                            let res = await fetch(s);
                            html = await res.text();
                        } else {
                            html = s;
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
                if (res.error) {
                    errorMsg.value = `${res.error}`;
                    source.parsed.items = [];
                } else {
                    source.parsed.items = res.items;
                }
            };

            async function onSavePersistentFileClick(payload: EventSaveFiles) {
                let persistent = generatePersistentFileContent({
                    all: payload.itemsList,
                    source: sourceInput.value,
                    playerItems: playerItemsJson.value
                });
                await downloadFile(new Blob([payload.rename], {type : 'application/json'}), 'rename.cmd.txt');
                await downloadFile(new Blob([persistent], {type : 'text/plain'}), 'page-source.txt');
                // TODO: show error; implement downloadFiles([])
            }

            const onClearErrorMsg = (newValue) => {
                errorMsg.value = newValue;
            };

            const onClearStorageClick = (event: MouseEvent) => {
                sourceInput.value = '';
                source.parsed.items = [];
                source.parsed.info.title = '';

                if (event.ctrlKey || (!sourceInput && source.parsed.items.length)) {
                    playerItemsJson.value = '';
                    playerItemsUrl.value = '';
                }

                errorMsg.value = '';
            };

            const onClearPlayItemsClick = () => {
                playerItemsUrl.value = '';
                source.parsed.items = [];
            };

            onMounted(() => {
                if (sourceInput.value) {
                    parseAndApplyNewHtml(sourceInput.value);
                }

                if (playerItemsJson.value) {
                    onParsePlayerItemsClick();
                }
            });

            //#region drag and drop

                const dragActive = ref(false);

                function on_dragenter(event: DragEvent) {
                    dragActive.value = true;
                }
                function on_dragleave(event: DragEvent) {
                    dragActive.value = false;
                }
                function on_dragover(event: DragEvent) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                async function on_drop(event: DragEvent) {
                    event.stopPropagation();
                    event.preventDefault();
                    dragActive.value = false;

                    const dt = event.dataTransfer;
                    if (dt.files.length) {
                        const fileHandle: File = dt.files[0];
                        const fileName = fileHandle.name; // after async op dt.files will be empty.
                        try {
                            const fileCnt = await textFileReader(fileHandle);
                            const res = parsePersistentFileContent(fileCnt);
                            if (res?.source) {
                                sourceInput.value = res.source;
                                onParseOrFetchHtmlClick();
                            }
                            if (res?.playerItems) {
                                if (!playerItemsUrl.value) {
                                    playerItemsUrl.value = 'dropped';
                                }
                                playerItemsJson.value = res.playerItems;
                                onParsePlayerItemsClick();
                            } else {
                                errorMsg.value = `Cannot parse file`;
                                console.log('File content ------\n', fileCnt, '\n------');
                            }
                        } catch (error) {
                            errorMsg.value = `Failed to read file ${fileName}`;
                            console.log('Failed to read file. error:', error);
                        }
                    }
                }

            //#endregion drag and drop

            return {
                sourceInput,
                playerItemsUrl,
                playerItemsJson,
                ...toRefs(source),

                errorMsg,
                showRawInfo,
                fetchBtnName,
                clearBtnElement,

                onParseOrFetchHtmlClick,
                onParsePlayerItemsClick,
                onSavePersistentFileClick,
                onClearStorageClick,
                onClearPlayItemsClick,
                onClearErrorMsg,

                dragActive,
                on_dragenter,
                on_dragleave,
                on_dragover,
                on_drop,
            }
        } //setup()
    });
</script>
