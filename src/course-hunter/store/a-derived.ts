import { atom } from "jotai";

import { isSourceUrl } from "./core/1-session";
import { buildBatchRenameFile, buildItemNames } from "./core/3-build-names";
import { sourceInputAtom } from "./a-local-storage-atoms";
import { itemsAtom } from "./a-local-storage-state";

/** The input holds a URL (fetch) rather than HTML (parse). */
export const isSourceUrlAtom = atom(
    (get) => isSourceUrl(get(sourceInputAtom))
);

/** Label of the button next to the input. */
export const buttonName_FetchOrParse_Atom = atom(
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

/** "00:04:15" (or "04:15") to seconds. Unparsable parts count as 0. */
function durationToSeconds(duration: string): number {
    return duration.split(':').reduce((acc, part) => acc * 60 + (parseInt(part, 10) || 0), 0);
}

export type DurationBar = {
    left: number;   // start of the element as percent of the total duration
    width: number;  // length of the element as percent of the total duration
};

/**
 * Position and size of each item's duration inside the bar that represents
 * the total duration of all items (in percent). Durations are static, so this
 * is computed once per items list and reused by every row.
 */
export const durationBarsAtom = atom((get): DurationBar[] => {
    const items = get(itemsAtom);
    const seconds = items.map((item) => durationToSeconds(item.duration));
    const total = seconds.reduce((sum, s) => sum + s, 0);

    let before = 0;
    return seconds.map((s) => {
        const bar: DurationBar = {
            left: total ? (before / total) * 100 : 0,
            width: total ? (s / total) * 100 : 0,
        };
        before += s;
        return bar;
    });
});

/** "Batch rename file" content: Windows `ren` commands. */
export const batchRenameFileAtom = atom(
    (get) => buildBatchRenameFile(get(itemsAtom))
);
