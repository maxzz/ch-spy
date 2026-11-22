import { atom, type Setter } from 'jotai';
import { downloadBlob } from '../../utils/lib/download';

import { type SessionPatch, isSourceUrl, parseStateFromCtxScript, patchStateFromCtxScript, patchFromHtml, patchFromPlayerItems } from './core/1-session';
import { generatePersistentFileContent, parsePersistentFileContent } from './core/2-engine';
import { allTogetherTextAtom, batchRenameFileAtom } from './a-derived';
import { playerItemsJsonAtom, sourceInputAtom } from './a-local-storage-atoms';
import { courseInfoAtom, itemsAtom, playerItemsUrlAtom, setErrorAtom } from './a-local-storage-state';

//---------------------------------------------------------------------------

/** "Fetch" (URL) or "Parse" (HTML, or text copied from this app). */
export const parseOrFetchAtom = atom(
    null,
    async (get, set) => {
        const text = get(sourceInputAtom);
        if (!text) {
            set(setErrorAtom, 'Type coursehuter.net course URL or paste html content from coursehuter.net');
            return;
        }

        try {
            const stateFromCtxScript = parseStateFromCtxScript(text);
            if (stateFromCtxScript) {
                applyPatch(set, patchStateFromCtxScript(stateFromCtxScript));
                document.getElementById(CLEAR_BUTTON_ID)?.focus();
                return;
            }

            const html = isSourceUrl(text) ? await (await fetch(text)).text() : text;
            applyPatch(set, patchFromHtml(html));
        } catch (error) {
            set(setErrorAtom, `Error: ${error}`);
        }
    }
);

/** Id of the Clear button; it gets focus after a copied state is pasted. */
export const CLEAR_BUTTON_ID = 'ch-clear-button';

/** Parses the player items JSON into the item list. */
export const parsePlayerItemsAtom = atom(
    null,
    (get, set) => {
        applyPatch(set, patchFromPlayerItems(get(playerItemsJsonAtom)));
    }
);

function applyPatch(set: Setter, patch: SessionPatch): void {
    if (patch.info) {
        set(courseInfoAtom, patch.info);
    }
    if (patch.items) {
        set(itemsAtom, patch.items);
    }
    if (patch.playerItemsUrl !== undefined) {
        set(playerItemsUrlAtom, patch.playerItemsUrl);
    }
    if (patch.playerItemsJson !== undefined) {
        set(playerItemsJsonAtom, patch.playerItemsJson);
    }
    if (patch.error !== undefined) {
        set(setErrorAtom, patch.error);
    }
}

//---------------------------------------------------------------------------

/** Clears the fetched course. Ctrl+Click also clears the player items. */
export const clearSourceAtom = atom(
    null,
    (_get, set, ctrlKey: boolean) => {
        set(sourceInputAtom, '');
        set(itemsAtom, []);
        set(courseInfoAtom, (prev) => ({ ...prev, title: '' }));

        if (ctrlKey) {
            set(playerItemsJsonAtom, '');
            set(playerItemsUrlAtom, '');
        }

        set(setErrorAtom, '');
    }
);

/** Clears the player items URL and the list built from it. */
export const clearPlayItemsAtom = atom(
    null,
    (_get, set) => {
        set(playerItemsUrlAtom, '');
        set(itemsAtom, []);
    }
);

/** Saves the rename script and the page source as two files. */
export const saveFilesAtom = atom(
    null,
    async (get) => {
        const persistent = generatePersistentFileContent({
            all: get(allTogetherTextAtom),
            source: get(sourceInputAtom),
            playerItems: get(playerItemsJsonAtom),
        });

        await downloadBlob(new Blob([get(batchRenameFileAtom)], { type: 'application/json' }), 'rename.cmd.txt');
        await downloadBlob(new Blob([persistent], { type: 'text/plain' }), 'page-source.txt');
    }
);

/** Loads a file dropped on the page: a saved "page-source" file or a plain text file. */
export const dropFileAtom = atom(
    null,
    async (get, set, file: File) => {
        const fileName = file.name;
        try {
            const text = await file.text();
            const res = parsePersistentFileContent(text);

            if (res?.source) {
                set(sourceInputAtom, res.source);
                void set(parseOrFetchAtom);
            }

            if (res?.playerItems) {
                if (!get(playerItemsUrlAtom)) {
                    set(playerItemsUrlAtom, 'dropped');
                }
                set(playerItemsJsonAtom, res.playerItems);
                set(parsePlayerItemsAtom);
            } else {
                set(setErrorAtom, 'Cannot parse file');
                console.log('File content ------\n', text, '\n------');
            }
        } catch (error) {
            set(setErrorAtom, `Failed to read file ${fileName}`);
            console.log('Failed to read file. error:', error);
        }
    }
);
