/*
 * Pure functions that turn pasted or stored input into state changes.
 * Store actions apply the returned patches; startup uses the same functions to restore the last session.
 */
import { type CourseInfo, type Item, getPlayerItemsUrl, parseHtmlToItems, parsePlayerItems } from './2-engine';

//---------------------------------------------------------------------------

/** Text copied from the "Copy" action of the Clear/Parse row (JSON with the page and its player items). */
export interface CopiedState {
    a: 'tm';                // marker
    docurl: string;
    itemsurl: string;
    doc: string;            // document.documentElement.outerHTML
    items: string;          // fetched items
}

export const NOTHING_DETECTED = 'Nothing detected';

export function isSourceUrl(text: string): boolean {
    return /^https?:\/\//.test(text);
}

export function parseCopiedState(text: string): CopiedState | undefined {
    if (!/^\{"a":"tm","docurl":"/.test(text)) {
        return undefined;
    }
    try {
        return JSON.parse(text) as CopiedState;
    } catch {
        console.error('Cannot parse pasted input.');
        return undefined;
    }
}

//---------------------------------------------------------------------------

/** Partial state update. A missing key means "leave unchanged". */
export interface SessionPatch {
    info?: CourseInfo;
    items?: Item[];
    playerItemsUrl?: string;
    playerItemsJson?: string;
    error?: string;
}

/** Page HTML: course info and lesson items from the page, or the player-items URL when the page has no items. */
export function patchFromHtml(html: string): SessionPatch {
    const parsed = parseHtmlToItems(html);
    if (parsed.items.length) {
        return { info: parsed.info, items: parsed.items, playerItemsUrl: '' };
    }

    const playerItemsUrl = getPlayerItemsUrl(html);
    return {
        info: parsed.info,
        items: [],
        playerItemsUrl,
        error: playerItemsUrl ? '' : NOTHING_DETECTED,
    };
}

//---------------------------------------------------------------------------

/** Player items JSON (copied from the player items URL). */
export function patchFromPlayerItems(itemsJson: string): SessionPatch {
    const res = parsePlayerItems(itemsJson);
    if (!res.ok) {
        return { items: [], error: `${res.error}` };
    }
    return { items: res.items };
}

//---------------------------------------------------------------------------

/** Copied state: page info plus the player items from the copy. */
export function patchFromCopiedState(data: CopiedState): SessionPatch {
    const { info } = parseHtmlToItems(data.doc);
    return {
        info,
        playerItemsUrl: data.itemsurl ?? '',
        playerItemsJson: data.items,
        ...patchFromPlayerItems(data.items),
    };
}

//---------------------------------------------------------------------------

/** Restores the session on startup. Errors are not shown: nothing was done by the user yet. */
export function patchFromStorage(htmlText: string, playerItemsJson: string): SessionPatch {
    let patch: SessionPatch = {};

    const copied = parseCopiedState(htmlText);
    if (copied) {
        patch = patchFromCopiedState(copied);
    } else if (htmlText && !isSourceUrl(htmlText)) {
        // A stored URL is not re-fetched on startup; only pasted/dropped HTML is re-parsed.
        patch = patchFromHtml(htmlText);
    }

    if (playerItemsJson) {
        patch = { ...patch, ...patchFromPlayerItems(playerItemsJson) };
    }
    return patch;
}
