<template>
    <div>
        <div class="main-title">{{title}}</div>
        <div class="container">
            <ul>
                <li v-for="(item, index) of items" :key="index">
                    <input :value="itemName(index, item, items)">
                    <a 
                        :class="{ nolink: !item.url }"
                        :href="item.url"
                        :download="item.url"
                        :title="itemIndex(index)"
                        tabindex="-1" 
                        target="blank"
                    ><span>{{item.duration}}</span> mp4
                    </a>
                </li>
            </ul>
        </div>
        <div v-if="items.length">
            <details open>
                <summary>All Together</summary>
                <textarea class="all-together" v-model="allText" readonly :rows="items.length + 1"></textarea>
            </details>
            <details open>
                <summary>Batch rename files</summary>
                <textarea class="all-rename" v-model="allBatch" readonly :rows="items.length + 2"></textarea>
            </details>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed } from "@vue/composition-api";
    import path from 'path';
    import { pad, Item } from '../engine';
    
    const itemInputName = (index, name) => `${pad(index + 1)} - ${name}`;
    const validateFname = (name) => {
        // Windows illegal: '\\/:*?"<>|'; or escaped /\\/:\*\?\"<>\|/
        return (name || '').trim().replace(/[\\\/:\*\?\"\<\>\|]/g, ';');
    };

    export default {
        props: ['items', 'title'],
        setup(props) {
            const itemIndex = (index) => {
                return `video ${index + 1}`;
            };

            const itemName = (index: number, item: Item, items: Item[]) => {
                return itemInputName(index, item.name);
            };

            const allText = computed(() => {
                return (props.items as Item[]).reduce((acc, item, index) => acc += `${itemInputName(index, item.name)}\n`, '');
            });

            const allBatch = computed(() => {
                return (props.items as Item[]).reduce((acc, item, index) => {
                    let orgFname = path.basename(item.url);
                    let orgExt = path.extname(orgFname);
                    let newFname = validateFname(itemInputName(index, item.name));
                    return acc += newFname ? `ren "${orgFname}" "${newFname}${orgExt}" \n` : '\n';
                }, 'chcp 1251\n');
            });

            return {
                itemIndex,
                itemName,
                allText,
                allBatch,
            };
        }
    };
</script>

<style lang="scss" scoped>
    .main-title {
        text-align: center;
        padding: 0.4em 0;
        color: #5d0083;
        background: radial-gradient(51.24% 146.46% at 68.55% 55.56%, rgba(255, 205, 30, 0.19) 0%, rgba(255, 255, 255, 0) 100%),
            linear-gradient(90deg, #88b0ff 2.83%, rgba(188, 148, 254, 0.51) 100%);
    }

    a {
        color: #1985ff;
        font-size: 0.7em;
        font-weight: normal;
        text-decoration: none;
    }
    a:visited {
        color: #3a2c68;
    }

    .nolink {
        color: red;
    }

    ul {
        margin: 0;
        padding: 0;
    }

    .container {
        border: 1px dotted #cecece;
        padding: 0 1em;
        background-color: #f1f1f1;
    }
    li {
        list-style: none;
        display: grid;
        grid-template-columns: 1fr min-content;
        align-items: center;
        column-gap: 0.4em;
    }
    li:hover {
        background-color: #90ff74;
    }
    li input {
        line-height: 1em;
        font-size: 1em;
        padding: 0.4em;
        border-radius: 2px;
        border: 1px solid #fcfcfc;
        background-color: hsla(0, 0%, 100%, 0.5);
        cursor: default;
    }
    li input:focus {
        background-color: #90ff74;
        outline: none;
        cursor: text;
    }

    details {
        margin: 1em;
        user-select: none;
        padding: .2em;
    }
    summary:focus {
        outline: none;
        cursor: pointer;
    }
    details textarea {
        width: 100%;
    }
</style>