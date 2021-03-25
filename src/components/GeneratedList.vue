<template>
    <div v-if="items.length">
        <div v-if="title" class="main-title">
            <div v-if="!desc">{{title}}</div>
            <div :title="title">{{desc}}</div>
        </div>

        <div class="flex justify-end">
            <button class="btn py-0 text-sm h-6" @click="downloadRename">Download rename.cmd</button>
        </div>

        <div class="container">
            <ul>
                <li v-for="(item, index) of items" :key="index">
                    <input :value="itemName(index, item, items)">
                    <download-button :url="item.url" />
                    <a 
                        :class="{ nolink: !item.url }"
                        :href="item.url"
                        :title="itemIndex(index)"
                        tabIndex="-1" 
                        target="blank"
                    >
                    <span>{{item.duration}}</span> mp4</a>
                </li>
            </ul>
        </div>

        <details><!-- <details open> -->
            <summary>Batch rename file</summary>
            <button @click="downloadRename">Download rename.cmd</button>
            <span class="rename-node"> * convert in notepad++ utf8 saved file to ansi for russian names</span>
            <textarea class="all-rename" v-model="allBatch" readonly :rows="items.length + 2"></textarea>
        </details>

        <details>
            <summary>All Together</summary>
            <textarea class="all-together" v-model="allText" readonly :rows="items.length + 1"></textarea>
        </details>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from "vue";
    import path from 'path-browserify'; //import path from 'path';
    import { pad2, Item } from '../core/engine';
    import downloadjs from 'downloadjs';
    import DownloadButton from './DownloadButton.vue';
    import CookieSetter from './CookieSetter.vue';

    const itemInputName = (index: number, name: string): string => `${pad2(index + 1)} - ${name.trim()}`;
    const validateFname = (name: string): string => {
        return (name || '').trim().replace(/[\\\/:\*\?\"\<\>\|]/g, ';'); // Windows illegal: '\\/:*?"<>|'; or escaped /\\/:\*\?\"<>\|/
    };

    export default defineComponent({
        props: [ 'items', 'title', 'desc' ],
        components: { DownloadButton, CookieSetter },
        setup(props: { items: Item[]; title: string; desc: string; }) {

            const itemIndex = (index: number | string): string => {
                return `video ${+index + 1}`;
            };

            const itemName = (index: number | string, item: Item, items: Item[]): string => {
                return itemInputName(+index, item.name);
            };

            const allText = computed(() => {
                return props.items.reduce((acc, item, index) => acc += `${itemInputName(index, item.name)}\n`, '');
            });

            const allBatch = computed(() => {
                return (props.items as Item[]).reduce((acc, item, index) => {
                    let orgFname = path.basename(item.url);
                    let orgExt = path.extname(orgFname);
                    let newFname = validateFname(itemInputName(index, item.name));
                    return acc += newFname ? `ren "${orgFname}" "${newFname}${orgExt}" \n` : '\n';
                }, 'chcp 1251\n');
            });

            const downloadRename = () => {
                downloadjs(allBatch.value, 'rename.cmd', 'text/plain');
            };

            return {
                itemIndex,
                itemName,
                allText,
                allBatch,
                downloadRename,
            };
        } //setup()
    });
</script>

<style lang="scss" scoped>
    .main-title {
        margin-top: 1rem;
        padding: 0.4em 0;
        text-align: center;
        cursor: default;
        color: #5d0083;
        background:
            //works so far for Firefox only: radial-gradient(51.24% 146.46% at 68.55% 55.56%, rgba(255, 205, 30, 0.19) 0%, rgba(255, 255, 255, 0) 100%),
            linear-gradient(90deg, #88b0ff 2.83%, rgba(188, 148, 254, 0.51) 100%);
    }

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
