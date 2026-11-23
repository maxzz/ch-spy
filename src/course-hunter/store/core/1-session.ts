/*
 * Pure functions that turn pasted or stored input into state changes.
 * Store actions apply the returned patches; startup uses the same functions to restore the last session.
 */
import { type CourseInfo, type OurItem, getPlayerItemsUrl, parseHtmlToItems } from "./2-html-parse";

//---------------------------------------------------------------------------

/** Partial state update. A missing key means "leave unchanged". */
export type SessionPatch = {
    info?: CourseInfo;
    items?: OurItem[];
    playerItemsUrl?: string;
    playerItemsJson?: string;
    error?: string;
};

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

export const NOTHING_DETECTED = 'Nothing detected';

//---------------------------------------------------------------------------

/** Restores the session on startup. Errors are not shown: nothing was done by the user yet. */
export function patchFromStorage(htmlText: string, playerItemsJson: string): SessionPatch {
    let patch: SessionPatch = {};

    const copied = parseStateFromCtxScript(htmlText);
    if (copied) {
        patch = patchStateFromCtxScript(copied);
    } else if (htmlText && !isSourceUrl(htmlText)) {
        // A stored URL is not re-fetched on startup; only pasted/dropped HTML is re-parsed.
        patch = patchFromHtml(htmlText);
    }

    if (playerItemsJson) {
        patch = { ...patch, ...patchFromPlayerItems(playerItemsJson) };
    }
    return patch;
}

export function isSourceUrl(text: string): boolean {
    return /^https?:\/\//.test(text);
}

//---------------------------------------------------------------------------

/** Text copied from the "Copy" action of the Clear/Parse row (JSON with the page and its player items). */
type StateFromCtxScript = {
    a: 'tm';                      // magic string to identify the result
    docurl: string;               // document url
    itemsurl: string | undefined; // player items url; if undefined then cannot get url from document
    doc: string;                  // document html
    items: string | undefined;    // player items json; if undefined then cannot fetch items from url
};

export function parseStateFromCtxScript(text: string): StateFromCtxScript | undefined {
    const isOurFormat = /^\{"a":"tm","docurl":"/.test(text);
    if (!isOurFormat) {
        return undefined;
    }

    try {
        return JSON.parse(text) as StateFromCtxScript;
    } catch {
        console.error('Cannot parse pasted input.');
        return undefined;
    }
}

//---------------------------------------------------------------------------

/** Copied state: page info plus the player items from the copy. */
export function patchStateFromCtxScript(data: StateFromCtxScript): SessionPatch {
    const { info } = parseHtmlToItems(data.doc);
    return {
        info,
        playerItemsUrl: data.itemsurl ?? '',
        playerItemsJson: data.items,
        ...patchFromPlayerItems(data.items),
    };
}

//---------------------------------------------------------------------------

/** Player items JSON (copied from the player items URL). */
export function patchFromPlayerItems(itemsJson: string | undefined): SessionPatch {
    const res = parsePlayerItems(itemsJson ?? '');
    if (!res.ok) {
        return { items: [], error: `${res.error}` };
    }
    return { items: res.items };
}

type PlayerItem = {             // items for build-in video player on the webpage
    id: string;                 // id: "c37871"
    file: string;               // remote file: "https://vss5.coursehunter.net/s/8f91140b938014446b02c00615768193/udemy-vueinfluencer/lesson1.mp4"
    subtitle: string;           // subtitle: "[English]https://vss5.coursehunter.net/udemy-vueinfluencer/lesson1.srt"
    title: string;              // title: "1 Introduction | 00:03:45"
};

export type PlayerItemsResult =
    | { ok: true; items: OurItem[]; }
    | { ok: false; error: unknown; };

/*for-test-only*/export function parsePlayerItems(itemsJson: string): PlayerItemsResult {
    const titleDuration = /([\s\S]+)\s*\|\s*(\d\d:\d\d:\d\d)$/;
    try {
        const json = JSON.parse(itemsJson) as PlayerItem[];
        const items = json.map((item): OurItem => {
            const m = titleDuration.exec(item.title);   // strip title duration
            return {
                dispname: m ? m[1] : item.title,
                duration: m ? m[2] : '',
                subtitle: !!item.subtitle?.length,
                url: item.file,
            };
        });
        return { ok: true, items };
    } catch (error) {
        return { ok: false, error };
    }
}

//---------------------------------------------------------------------------
