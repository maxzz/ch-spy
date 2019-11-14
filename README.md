# coursehunters-course-list-browser

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Cookie

```js
    // https://stackoverflow.com/questions/595228/how-can-i-delete-all-cookies-with-javascript
    /*
    org: CHUNTERS=sn9mlunjt9ka7k55euahoudg56; locale=ru; ch_quiz=dce74e1d9cb6bac3bb2dd9bca41775b4; redirect_after_login=https://coursehunter.net/course/eticheskiy-vzlom-vzlom-veb-prilozheniy; user_ident=67097d78-12b6-4e9b-97d4-6a3611e22a46; accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJodHRwczpcL1wvY291cnNlaHVudGVyLm5ldCIsImF1ZCI6Imh0dHBzOlwvXC9jb3Vyc2VodW50ZXIubmV0IiwianRpIjoiNGYxZzIzYTEyYWEiLCJpYXQiOjE1NzM3MjI4NDEsIm5iZiI6MTU3MzcyMjkwMSwiZXhwIjoxNTc0MzI3NjQxLCJ1c2VyX2lkIjoiMzQ0MjIiLCJlX21haWwiOiJtYXh6ejIwMDBAZ21haWwuY29tIn0.EOVzHBofbLJYHjKXJY_g2tXRVzzpoBYFQ3G0iHftGRE
    document.cookie -> `
        CHUNTERS=sn9mlunjt9ka7k55euahoudg56; 
        locale=ru; 
        ch_quiz=dce74e1d9cb6bac3bb2dd9bca41775b4; 
        redirect_after_login=https://coursehunter.net/course/eticheskiy-vzlom-vzlom-veb-prilozheniy; 
        user_ident=67097d78-12b6-4e9b-97d4-6a3611e22a46; 
        accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJodHRwczpcL1wvY291cnNlaHVudGVyLm5ldCIsImF1ZCI6Imh0dHBzOlwvXC9jb3Vyc2VodW50ZXIubmV0IiwianRpIjoiNGYxZzIzYTEyYWEiLCJpYXQiOjE1NzM3MjI4NDEsIm5iZiI6MTU3MzcyMjkwMSwiZXhwIjoxNTc0MzI3NjQxLCJ1c2VyX2lkIjoiMzQ0MjIiLCJlX21haWwiOiJtYXh6ejIwMDBAZ21haWwuY29tIn0.EOVzHBofbLJYHjKXJY_g2tXRVzzpoBYFQ3G0iHftGRE`
    */
    function setCookie() {
        let v = 'CHUNTERS=sn9mlunjt9ka7k55euahoudg56; locale=ru; ch_quiz=dce74e1d9cb6bac3bb2dd9bca41775b4; redirect_after_login=https://coursehunter.net/course/eticheskiy-vzlom-vzlom-veb-prilozheniy; user_ident=67097d78-12b6-4e9b-97d4-6a3611e22a46; accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJodHRwczpcL1wvY291cnNlaHVudGVyLm5ldCIsImF1ZCI6Imh0dHBzOlwvXC9jb3Vyc2VodW50ZXIubmV0IiwianRpIjoiNGYxZzIzYTEyYWEiLCJpYXQiOjE1NzM3MjI4NDEsIm5iZiI6MTU3MzcyMjkwMSwiZXhwIjoxNTc0MzI3NjQxLCJ1c2VyX2lkIjoiMzQ0MjIiLCJlX21haWwiOiJtYXh6ejIwMDBAZ21haWwuY29tIn0.EOVzHBofbLJYHjKXJY_g2tXRVzzpoBYFQ3G0iHftGRE';
        (v || '').split(';').map(_ => _.trim()).forEach(_ => document.cookie = _);
    }
```