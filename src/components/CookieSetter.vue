<template>
    <div class="cookie">
        <input type="text" v-model="cookieInp" placeholder="Type cookie">
        <button @click="clearCookie">Clear Document Cookie</button>
        <button @click="setCookie">Set Cookie</button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';

    function setCookieValue(name, value, domain?, path?): void {
        var domain = domain || document.domain;
        var path = path || "/";
        let d = new Date();
        if (!!value) {
            d.setDate(d.getDate() + 7);
        } else {
            d.setDate(d.getDate() - 1);
        }
        document.cookie = `${name}=${value}; expires=${d}; domain=${domain}; path=${path}`;
    }

    function splitCookie(cookieStr: string): string[][] {
        return (cookieStr || '').split(';').map(_ => _.trim()).filter(_ => Boolean).map(_ => _.split('=')).filter(_ => !!_[0]);
    }

    export default defineComponent({
        setup() {
            const cookieInp = ref('CHUNTERS=sn9mlunjt9ka7k55euahoudg56; locale=ru; ch_quiz=dce74e1d9cb6bac3bb2dd9bca41775b4; redirect_after_login=https://coursehunter.net/course/eticheskiy-vzlom-vzlom-veb-prilozheniy; user_ident=67097d78-12b6-4e9b-97d4-6a3611e22a46; accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJodHRwczpcL1wvY291cnNlaHVudGVyLm5ldCIsImF1ZCI6Imh0dHBzOlwvXC9jb3Vyc2VodW50ZXIubmV0IiwianRpIjoiNGYxZzIzYTEyYWEiLCJpYXQiOjE1NzM3MjI4NDEsIm5iZiI6MTU3MzcyMjkwMSwiZXhwIjoxNTc0MzI3NjQxLCJ1c2VyX2lkIjoiMzQ0MjIiLCJlX21haWwiOiJtYXh6ejIwMDBAZ21haWwuY29tIn0.EOVzHBofbLJYHjKXJY_g2tXRVzzpoBYFQ3G0iHftGRE');

            const setCookie = () => {
                if (cookieInp.value) {
                    splitCookie(cookieInp.value).forEach(_ => {
                        console.log('set', _);
                        setCookieValue(_[0], _[1]);
                    });
                }
            };

            const clearCookie = () => {
                let v = document.cookie;
                splitCookie(v).forEach(_ => {
                    console.log('get', _);
                    setCookieValue(_[0], '');
                });

                console.log('Current Cookie', document.cookie);
            };

            return {
                cookieInp,
                setCookie,
                clearCookie,
            };
        } //setup()
    });
</script>

<style lang="scss" scoped>
    .cookie {
        margin: 1em;
        display: grid;
        grid-template-columns: 1fr auto auto;
        grid-column-gap: .2em;
    }
    .cookie input {
        line-height: 1.2em;
    }
</style>
