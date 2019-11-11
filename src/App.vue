<template>
    <div id="app">
        <div class="controls">
            <input type="text" v-model="urlInput" placeholder="URL from courcehunter.net">
            <button @click="fetchData">Fetch</button>
            <br>
            <button @clcik="clearStorage3">Clear</button>
        </div>
        <GeneratedList :items="items" :title="title"/>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { ref, onMounted } from '@vue/composition-api';
    import GeneratedList from './components/GeneratedList.vue';
    import { htmlToItems } from './engine';

    export default {
        name: "app",
        components: {
            GeneratedList
        },
        setup() {
            let urlInput = ref('https://coursehunter.net/course/sozdavayte-igry-v-realnom-vremeni-s-node-js');

            let items = ref([]);
            let title = ref('');

            onMounted(() => {
                checkStorage();
            });

            const checkStorage = () => {
                let html = localStorage.getItem('coursehunters-last');
                if (html) {
                    let parced = htmlToItems(html);
                    items.value = parced.items;
                    title.value = parced.title;
                    console.log(items.value);
                }
            }

            const clearStorage3 = () => {
                console.log('1');
                
                debugger
                localStorage.removeItem('coursehunters-last');
                items.value = [];
                title.value = '';
            };

            const fetchData = async () => {
                console.log('2');

                const opts = {
                    headers: {
                        cookie: {
                            accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJodHRwczpcL1wvY291cnNlaHVudGVyLm5ldCIsImF1ZCI6Imh0dHBzOlwvXC9jb3Vyc2VodW50ZXIubmV0IiwianRpIjoiNGYxZzIzYTEyYWEiLCJpYXQiOjE1NzM0NTk3NDEsIm5iZiI6MTU3MzQ1OTgwMSwiZXhwIjoxNTc0MDY0NTQxLCJ1c2VyX2lkIjoiMzQ0MjIiLCJlX21haWwiOiJtYXh6ejIwMDBAZ21haWwuY29tIn0.t0SS3OaKkOUFjZqZLtYsb6myIve6yrlRIvQB8naM4No'
                        }
                    }
                }

                if (urlInput.value) {
                    let res = await fetch(urlInput.value, {
                        credentials: 'include'
                    });
                    let html = await res.text();
                    let parced = htmlToItems(html); 
                    items.value = parced.items;
                    title.value = parced.title;
                    
                    localStorage.setItem('coursehunters-last', html);
                }
            };

            return {
                urlInput,
                items,
                title,
                fetchData,
                clearStorage3,
            }
        }
    } as any;
</script>

<style lang="scss">
    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        //text-align: center;
        color: #2c3e50;
        //margin-top: 60px;
    }

    .controls {
        display: grid;
        grid-template-columns: 1fr min-content min-content;

        input {
            padding: .5em;
        }
        button {
            user-select: none;
        }
    }
</style>
