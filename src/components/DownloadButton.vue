<template>
    <div class="relative">
        <button
            class="btn py-0 text-sm h-6"
            :disabled="disabledBtn" @click="onDownloadFileClick(url)"
        >Get</button>

        <div v-if="progressPersent !== 0" class="progress">{{progressPersent}}</div>
        <div v-if="tryed" class="meter">
            <span 
                :style="{width: succeeded ? '100%' : progressPersent + '%'}"
                :class="{failed: failed}">
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';
    //import path from 'path';
    import path from 'path-browserify';
    import jsDownloader from 'js-file-downloader'; //TODO: Upgrade to 1.1.15 (warning: w/ diff API) // problem: handle timout; no cancel operation;

    export default defineComponent({
        props: {
            url: String
        },
        setup() {
            const progressPersent = ref(0);
            const disabledBtn = ref(false);
            const succeeded = ref(false);
            const failed = ref(false);
            const tryed = ref(false);

            function stateStart() {
                tryed.value = true;
                succeeded.value = false;
                failed.value = false;
                disabledBtn.value = true;
                progressPersent.value = 0;
            }

            function stateFailed(url: string, err: string) {
                disabledBtn.value = false;
                succeeded.value = false;
                failed.value = true;
                console.log('err', url, err);
            }

            function stateDone(url: string) {
                disabledBtn.value = false;
                progressPersent.value = 0;
                succeeded.value = true;
                failed.value = false;
                console.log('done', url);               
            }

            function process(event) {
                if (!event.lengthComputable) {
                    progressPersent.value = 50;
                    return;
                }
                var downloadingPercentage = Math.floor(event.loaded / event.total * 100);
                progressPersent.value = downloadingPercentage;
            }

            const onDownloadFileClick = (url: string): void => {
                //download(url);

                stateStart();

                let filename = path.basename(url);
                new jsDownloader({
                    url: url,
                    process: process,
                    filename: filename,
                    timeout: 2 * 60 * 1000,
                })
                .then(function done() {
                    stateDone(url);
                })
                .catch(function err(err) {
                    stateFailed(url, err);
                })
            };

            return {
                progressPersent,
                disabledBtn,
                succeeded,
                failed,
                tryed,
                onDownloadFileClick,
            };
        } //setup()
    });
</script>

<style lang="scss" scoped>
    // https://css-tricks.com/css3-progress-bars/
    
    .progress {
        position: absolute;
        padding: .3em .5em;
        text-align: right;
        top: 0;
        right: 0;
        width: 1.7em;
        font-size: .7em;
        color: green;
        background-color: #ddd;
    }

    .meter { 
        height: .2em;  /* Can be anything */
        position: relative;
        background: rgb(209, 255, 198);
        border-radius: .2em;
        //padding: .2em;
        box-shadow: inset 0 -1px 1px rgba(255,255,255,0.3);

        & > span {
            display: block;
            height: 100%;
    
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
    
            background-color: rgb(43,194,83);
            background-image: linear-gradient(center bottom, rgb(43,194,83) 37%, rgb(84,240,84) 69%);
            box-shadow: 
                inset 0 2px 9px  rgba(255,255,255,0.3),
                inset 0 -2px 6px rgba(0,0,0,0.4);
            position: relative;
            overflow: hidden;
        }    
    
        & > span.failed {
            background-color: red;
        }
    }
</style>
