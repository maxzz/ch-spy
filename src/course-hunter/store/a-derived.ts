import { atom } from 'jotai';

import { buildBatchRenameFile, buildItemNames } from './core/rename';
import { isSourceUrl } from './core/1-session';
import { sourceInputAtom } from './a-local-storage-atoms';
import { itemsAtom } from './a-local-storage-state';

/** The input holds a URL (fetch) rather than HTML (parse). */
export const isSourceUrlAtom = atom(
    (get) => isSourceUrl(get(sourceInputAtom))
);

/** Label of the button next to the input. */
export const fetchButtonNameAtom = atom(
    (get) => {
        if (!get(sourceInputAtom)) {
            return '';
        }
        return get(isSourceUrlAtom) ? 'Fetch' : 'Parse';
    }
);

/** Numbered display names of the items. */
export const itemNamesAtom = atom(
    (get) => buildItemNames(get(itemsAtom))
);

/** "All Together" text: one name per line. */
export const allTogetherTextAtom = atom(
    (get) => get(itemNamesAtom).map((name) => `${name}\n`).join('')
);

/** "Batch rename file" content: Windows `ren` commands. */
export const batchRenameFileAtom = atom(
    (get) => buildBatchRenameFile(get(itemsAtom))
);
