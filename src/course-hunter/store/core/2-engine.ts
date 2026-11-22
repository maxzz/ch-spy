import { type CheerioAPI, load } from 'cheerio';
import { type CourseDescription, reAxiosItemsQuery, reFileItem } from './9-content-match-regexes';

//---------------------------------------------------------------------------

export interface Item {
    dispname: string;       // display name
    duration: string;       // video duration: '00:04:15'
    subtitle?: boolean;     // if true the srt file has the same name
    url: string;            // video URL
}

export interface CourseInfo {
    title?: string;         // course title
    desc?: string;          // course description
    producerUrl?: string;   // course producer URL
    producerName?: string;  // course producer name
    preview?: string;       // preview URL: "https://cdn.coursehunter.net/course/glubokie-osnovy-javascript-v2.jpg"
    site?: string;          // coursehunter URL: "https://coursehunter.net/course/nodejs-polnoe-rukovodstvo"
    duration?: string;      // course duration: '10:17:09'
    raw: Partial<CourseDescription>; // raw information from the embedded script
}

export interface ParseResult {
    items: Item[];          // items on the page
    info: CourseInfo;       // collected information
}

export function parseHtmlToItems(html: string): ParseResult {
    const $ = load(html);

    const rv: ParseResult = {
        items: [],
        info: {
            title: $('.hero-title').text(),
            desc: $('.hero-description').text(),
            producerUrl: $('.hero-source').children('a').attr('href'),  // if not found: undefined
            producerName: $('.hero-source').children('a').text(),       // if not found: empty string
            preview: $('meta[property="og:image"]').attr('content'),
            site: $('meta[property="og:url"]').attr('content'),
            duration: $('.course-box-value').first().text(),
            raw: getDescriptionJson($) ?? {},
        },
    };

    rv.info.raw.datePublished = convertTimeRuToLocal(rv.info.raw.datePublished);
    rv.info.raw.dateModified = convertTimeRuToLocal(rv.info.raw.dateModified);

    let items = scanForOldDefinitions($);

    if (!items) {
        for (const script of $('script').toArray()) {
            const isInlineScript = !Object.keys(script.attribs).length; // i.e. just <script> w/o attributes; a script with 'src' is not inline.
            if (isInlineScript) {
                items = handleScriptWithPlayerItems($(script).text());
                if (items) {
                    break;
                }
            }
        }
    }

    rv.items = items ?? [];
    return rv;
}

//---------------------------------------------------------------------------

export function getPlayerItemsUrl(html: string): string {
    const m = reAxiosItemsQuery.exec(html);
    return m ? `https://coursehunter.net${m[0]}` : '';
}

//---------------------------------------------------------------------------

interface PlayerItem {          // items for build-in video player on the webpage
    id: string;                 // id: "c37871"
    file: string;               // remote file: "https://vss5.coursehunter.net/s/8f91140b938014446b02c00615768193/udemy-vueinfluencer/lesson1.mp4"
    subtitle: string;           // subtitle: "[English]https://vss5.coursehunter.net/udemy-vueinfluencer/lesson1.srt"
    title: string;              // title: "1 Introduction | 00:03:45"
}

export type PlayerItemsResult =
    | { ok: true; items: Item[]; }
    | { ok: false; error: unknown; };

export function parsePlayerItems(itemsJson: string): PlayerItemsResult {
    const titleDuration = /([\s\S]+)\s*\|\s*(\d\d:\d\d:\d\d)$/;
    try {
        const json = JSON.parse(itemsJson) as PlayerItem[];
        const items = json.map((item): Item => {
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

export interface PersistentContent {
    all: string;            // batch rename list
    source: string;         // source html or URL
    playerItems: string;    // player items JSON
}

//---------------------------------------------------------------------------

export function generatePersistentFileContent({ all, source, playerItems }: PersistentContent): string {
    return `--------------------------------- 1 - player list ---------------------------------
${(all || '').trim()}
--------------------------------- 2 - source html ---------------------------------
${(source || '').trim()}
--------------------------------- 3 - source player items -------------------------
${(playerItems || '').trim()}
--------------------------------- 4 - end -----------------------------------------
`;
}

//---------------------------------------------------------------------------

export function parsePersistentFileContent(fileCnt: string): PersistentContent | undefined {
    // Section separators: -{33} \d - [^-]* -{10,}
    const re = /-{33} \d - [^-]* -{10,}\r?\n/g;
    const m = fileCnt.split(re);
    if (m.length >= 5) { // 0 and 4 elements are empty because we use split
        return {
            all: m[1],
            source: m[2],
            playerItems: m[3],
        };
    }
    return undefined;
}

//---------------------------------------------------------------------------
// Internals

function getDescriptionJson($: CheerioAPI): CourseDescription | undefined {
    for (const script of $('script[type="application/ld+json"]').toArray()) {
        let raw: CourseDescription | undefined;
        try {
            raw = JSON.parse($(script).text())?.[0];
        } catch {
            // Invalid JSON-LD block: try the next one.
        }
        if (raw) {
            return raw;
        }
    }
    return undefined;
}

function convertTimeRuToLocal(dateStr: string | undefined): string {
    if (!dateStr) {
        return '';
    }
    const a = dateStr.split('-'); // yyyy-mm-dd
    if (a.length !== 3) {
        return '';
    }
    const date = new Date(Date.UTC(+a[0], +a[1] - 1, +a[2])); // y-m-d
    return date.toLocaleDateString('en-US', { year: '2-digit', day: '2-digit', month: '2-digit' }).replace(/\//g, '.');
}

function scanForOldDefinitions($: CheerioAPI): Item[] | undefined {
    const items: Item[] = [];
    $('.lessons-item').each((_index, el) => {
        let mediaUrl = $('[itemprop=contentUrl]', el).attr('href');
        if (!mediaUrl) { // website updated on 08.23.20
            const m = /"contentUrl":\s*"(https:\/\/[^"]+\.mp4)"/.exec($('script', el).first().text());
            if (m) {
                mediaUrl = m[1];
            }
        }
        items.push({
            dispname: $('.lessons-name', el).text(),
            duration: $('.lessons-duration', el).text(),
            url: mediaUrl ?? '',
        });
    });
    return items.length ? items : undefined;
}

function handleScriptWithPlayerItems(scriptText: string | undefined): Item[] | undefined {
    const matches = [...(scriptText || '').matchAll(reFileItem)];
    if (!matches.length) {
        return undefined;
    }

    const items: Item[] = matches
        .map((m): Item => ({ dispname: m[1], duration: '', url: m[2] }))
        .filter((item) => !/sample.mp4/.test(item.url)); // Remove two commented items.

    for (const item of items) {
        // Correct name for each item
        const reTitleDuration = /^\d*\) #{0,1}([\.\d]+){0,1}\s*(.*) \| (.*)/;
        const match = item.dispname.match(reTitleDuration); // "1) #0 What&#039;s New In Framer Motion 2 | 00:04:15" or "1) 1.1. AE Basics | 00:31:36"
        if (match) {
            item.dispname = match[2];
            item.duration = match[3];

            if (match[1]) { // '1.1.' -> '01.1'
                let prefix = match[1];
                const parts = prefix.split('.').filter(Boolean);
                if (parts.length) {
                    parts[0] = pad2(+parts[0]);
                    prefix = parts.join('.');
                }
                item.dispname = `${prefix} - ${item.dispname}`;
            }
        }
    }
    return items;
}

function pad2(n: number): string {
    if (n < 10) {
        return `0${n}`;
    }
    return `${n}`;
}
