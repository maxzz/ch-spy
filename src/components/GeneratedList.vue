<template>
    <div v-if="items.length" class="relative">
        <div v-if="title" class="main-title pb-2 min-h-[4rem] flex items-end justify-center font-bold text-[#5d0083] bg-gradient-to-r from-[#88b0ff] to-[#bc94fe82]">
            <!-- linear-gradient(90deg, #88b0ff 2.83%, rgba(188, 148, 254, 0.51) 100%) -->
            <div v-if="!desc">
                {{title}}
            </div>
            <div :title="title">
                {{desc}}
            </div>
        </div>

        <div class="flex justify-end absolute top-0 right-0">
            <button class="btn py-0 text-sm h-6" @click="onClickDownloadReadmeFile">
                Download rename.cmd
            </button>
        </div>

        <div class="container">
            <ul>
                <li v-for="(item, index) of items" :key="index">
                    <input :value="itemName(index, item, items)">
                    <DownloadButton :url="item.url" />
                    <a 
                        :class="{ nolink: !item.url }"
                        :href="item.url"
                        :title="itemIndex(index)"
                        tabIndex="-1" 
                        target="blank"
                    >
                        <span>{{item.duration}}</span> mp4
                    </a>
                </li>
            </ul>
        </div>

        <details><!-- <details open> -->
            <summary>Batch rename file</summary>
            <button @click="onClickDownloadReadmeFile">Download rename.cmd</button>
            <span class="rename-node"> * convert in notepad++ utf8 saved file to ansi for russian names</span>
            <textarea class="all-rename" v-model="allTogetherBatchFile" readonly :rows="items.length + 2"></textarea>
        </details>

        <details>
            <summary>All Together</summary>
            <textarea class="all-together" v-model="allTogetherTextFile" readonly :rows="items.length + 1"></textarea>
        </details>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, PropType } from "vue";
    import path from 'path-browserify'; //import path from 'path';
    import { Item } from '../core/engine';
    import DownloadButton from './DownloadButton.vue';
    import CookieSetter from './CookieSetter.vue';

    function numberLength(n: number): number {
        return n < 10 ? 1 : n < 100 ? 2 : 3;
    }

    function itemInputName(index: number, name: string, total: number): string {
        // 0. Remove duplicated file index.
        let m = /^(\d+)\s*-?\s*(.*)/.exec(name);
        let s = m && +m[1] === index + 1 ? m[2] : name;
        return `${String(index + 1).padStart(numberLength(total), '0')} - ${s.trim()}`;
    }

    function validateFname(name: string): string {
        return (name || '').trim().replace(/[\\\/:\*\?\"\<\>\|]/g, ';'); // Windows illegals: '\\/:*?"<>|'; or escaped /\\/:\*\?\"<>\|/
    }

    export type EventSaveFiles = {
        rename: string;
        itemsList: string;
    }

    export default defineComponent({
        props: {
            items: Array as PropType<Item[]>,
            title: String,
            desc: String
        },
        components: { DownloadButton, CookieSetter },
        emits: ['save-files'],
        setup(props, { emit }) {
            const allTogetherTextFile = computed(() => {
                return props.items.reduce((acc, item, index) => acc += `${itemInputName(index, item.name, props.items.length)}\n`, '');
            });

            const allTogetherBatchFile = computed(() => {
                return props.items.reduce((acc, item, index) => {
                    let orgFname = path.basename(item.url);
                    let orgExt = path.extname(orgFname);
                    let newFname = validateFname(itemInputName(index, item.name, props.items.length));
                    return acc += newFname ? `ren "${orgFname}" "${newFname}${orgExt}" \n` : '\n';
                }, 'chcp 1251\n');
            });

            const itemIndex = (index: number | string): string => {
                return `video ${+index + 1}`;
            };

            const itemName = (index: number | string, item: Item, items: Item[]): string => {
                return itemInputName(+index, item.name, items.length);
            };

            const onClickDownloadReadmeFile = () => {
                emit('save-files', {rename: allTogetherBatchFile.value, itemsList: allTogetherTextFile.value} as EventSaveFiles);
            };

            return {
                itemIndex,
                itemName,
                allTogetherTextFile,
                allTogetherBatchFile,
                onClickDownloadReadmeFile,
            };
        } //setup()
    });
</script>

<style lang="scss" scoped>
    // .main-title {
        //margin-top: 1rem;
        //padding: 0.4em 0;
        //text-align: center;
        //cursor: default;
        //color: #5d0083;
        // background:
        //     //works so far for Firefox only: radial-gradient(51.24% 146.46% at 68.55% 55.56%, rgba(255, 205, 30, 0.19) 0%, rgba(255, 255, 255, 0) 100%),
        //     linear-gradient(90deg, #88b0ff 2.83%, rgba(188, 148, 254, 0.51) 100%);
    // }

    .container {
        border: 1px dotted #cecece;
        background-color: #f1f1f1;

        ul {
            margin: 0;
            padding: 0;
        }

        li {
            list-style: none;
            display: grid;
            grid-template-columns: 1fr min-content min-content;
            column-gap: .6rem;
            align-items: center;

            &:hover {
                background-color: #90ff74;
            }
        }
        li input {
            line-height: 1rem;
            font-size: .9rem;
            padding: 0.4rem;
            border-radius: 2px;
            border: 1px solid #fcfcfc;
            background-color: hsla(0, 0%, 100%, 0.5);
            cursor: default;

            &:focus {
                background-color: #90ff74;
                outline: none;
                cursor: text;
            }
        }

        a {
            padding-right: .6rem;
            font-size: 0.7em;
            font-weight: normal;
            text-decoration: none;
            color: #1985ff;

            &:visited {
                color: green;
            }
        }

        .nolink {
            color: red;
        }
    }

    /* Details */

    details {
        margin: 1em 0;
        padding: .2rem 0;
        font-size: .9rem;
        user-select: none;
    }

    summary:focus {
        outline: none;
        cursor: pointer;
    }

    details textarea {
        margin-top: .2rem;
        width: 100%;
    }

    .rename-node {
        font-size: .7em;
    }

</style>
