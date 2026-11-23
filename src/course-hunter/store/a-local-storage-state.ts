import { atom } from 'jotai';
import { plainLocalStorage } from '../../utils/lib/local-storage';

import type { CourseInfo, OurItem } from './core/2-html-parse';
import { patchFromStorage } from './core/1-session';
import { STORAGE_KEY_HTML, STORAGE_KEY_PLAYER_ITEMS } from './a-local-storage-atoms';

const ERROR_TIMEOUT_MS = 5000;

// Restore the last session once, when the module loads. Plain values for the atoms below.
const restored = patchFromStorage(
    plainLocalStorage.getItem(STORAGE_KEY_HTML, ''),
    plainLocalStorage.getItem(STORAGE_KEY_PLAYER_ITEMS, ''),
);

/** Course info shown in the header and the list title. */
export const courseInfoAtom = atom<CourseInfo>(restored.info ?? { raw: {} });

/** Lesson items of the course list (from the page or from the player items). */
export const itemsAtom = atom<OurItem[]>(restored.items ?? []);

/** URL that serves the player items; empty when there is nothing to fetch. */
export const playerItemsUrlAtom = atom<string>(restored.playerItemsUrl ?? '');

/** Error message shown in the red bar. Empty when there is no error. */
export const errorMsgAtom = atom<string>('');

/** Set an error (auto-clears after a few seconds) or clear it with ''. */
let errorTimer: ReturnType<typeof setTimeout> | undefined;

export const setErrorAtom = atom(
    null,
    (_get, set, message: string) => {
        clearTimeout(errorTimer);
        set(errorMsgAtom, message);
        if (message) {
            errorTimer = setTimeout(() => set(errorMsgAtom, ''), ERROR_TIMEOUT_MS);
        }
    }
);

/** Whether the raw info block (JSON) is open. */
export const showRawInfoAtom = atom(false);

/** True while a file is dragged over the page. */
export const dragActiveAtom = atom(false);

/** Whether item names can be edited in the list. */
export const editableTitlesAtom = atom(false);
