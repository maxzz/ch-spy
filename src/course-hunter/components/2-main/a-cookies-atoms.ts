import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { setCookieValue, splitCookie } from '../../../utils/lib/cookies';

// Dev-only helpers from the previous app. They are not shown in production builds.

const DEFAULT_COOKIE_TEXT = 'CHUNTERS=sn9mlunjt9ka7k55euahoudg56; locale=ru; ch_quiz=dce74e1d9cb6bac3bb2dd9bca41775b4; redirect_after_login=https://coursehunter.net/course/eticheskiy-vzlom-vzlom-veb-prilozheniy; user_ident=67097d78-12b6-4e9b-97d4-6a3611e22a46; accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJodHRwczpcL1wvY291cnNlaHVudGVyLm5ldCIsImF1ZCI6Imh0dHBzOlwvXC9jb3Vyc2VodW50ZXIubmV0IiwianRpIjoiNGYxZzIzYTEyYWEiLCJpYXQiOjE1NzM3MjI4NDEsIm5iZiI6MTU3MzcyMjkwMSwiZXhwIjoxNTc0MzI3NjQxLCJ1c2VyX2lkIjoiMzQ0MjIiLCJlX21haWwiOiJtYXh6ejIwMDBAZ21haWwuY29tIn0.EOVzHBofbLJYHjKXJY_g2tXRVzzpoBYFQ3G0iHftGRE';

/** Text typed into the cookie input. */
export const cookieInputAtom = atom(DEFAULT_COOKIE_TEXT);

/** Sets every "name=value" pair from the input as a cookie. */
export const setCookiesAtom = atom(null, (get) => {
    const text = get(cookieInputAtom);
    if (text) {
        splitCookie(text).forEach(([name, value]) => {
            console.log('set', name, value);
            setCookieValue(name, value);
        });
    }
});

/** Deletes all cookies that the current page can see. */
export const clearCookiesAtom = atom(null, () => {
    splitCookie(document.cookie).forEach((cookie) => {
        console.log('get', cookie);
        setCookieValue(cookie[0], '');
    });
    console.log('Current Cookie', document.cookie);
});

export interface StorageTextValue {
    counter: number;
    text: string;
}

/** Stored as JSON under the "bop" key, as in the previous app. */
export const storageTextAtom = atomWithStorage<StorageTextValue>('bop', { counter: 0, text: '' }, createJSONStorage(() => localStorage));
