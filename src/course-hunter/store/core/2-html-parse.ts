import { type CheerioAPI, load } from "cheerio";
import { type CourseDescription, reFileItem } from "./9-content-match-regexes";

//---------------------------------------------------------------------------

export type CourseInfo = {
    title?: string;         // course title
    desc?: string;          // course description
    producerUrl?: string;   // course producer URL
    producerName?: string;  // course producer name
    preview?: string;       // preview URL: "https://cdn.coursehunter.net/course/glubokie-osnovy-javascript-v2.jpg"
    site?: string;          // coursehunter URL: "https://coursehunter.net/course/nodejs-polnoe-rukovodstvo"
    duration?: string;      // course duration: '10:17:09'
    raw: Partial<CourseDescription>; // raw information from the embedded script
};

//---------------------------------------------------------------------------

export type OurItem = {     // our item for the course
    dispname: string;       // display name
    duration: string;       // video duration: '00:04:15'
    subtitle?: boolean;     // if true the srt file has the same name
    url: string;            // video URL
};

type ParseHtmlToItemsResult = {
    items: OurItem[];       // our items for the course on the page
    info: CourseInfo;       // collected information
};

export function parseHtmlToItems(html: string): ParseHtmlToItemsResult {
    const $ = load(html);

    const courseInfo = getDescriptionJson($) ?? {};
    
    const rv: ParseHtmlToItemsResult = {
        items: [],
        info: {
            title: $('.hero-title').text(),
            desc: $('.hero-description').text(),
            producerUrl: $('.hero-source').children('a').attr('href'),  // if not found: undefined
            producerName: $('.hero-source').children('a').text(),       // if not found: empty string 
            preview: $('meta[property="og:image"]').attr('content'),
            site: $('meta[property="og:url"]').attr('content'),
            duration: $('.course-box-value').first().text(),
            raw: courseInfo,
        },
    };

    if (courseInfo) {
        if (!rv.info.title) {
            rv.info.title = (courseInfo as any).name;
        }
    }

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

const reAxiosItemsQuery = /\/course\/\d{3,10}?\/lessons/; // Lesson list URL the site uses to load items with axios: axios.get('/course/3787/lessons')

//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// Internals

function getDescriptionJson($: CheerioAPI): CourseDescription | undefined {
    for (const script of $('script[type="application/ld+json"]').toArray()) {
        let raw: CourseDescription | undefined;
        try {
            console.log("getDescriptionJson: \n", $(script).text());
            raw = JSON.parse($(script).text());
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

function scanForOldDefinitions($: CheerioAPI): OurItem[] | undefined {
    const items: OurItem[] = [];
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

function handleScriptWithPlayerItems(scriptText: string | undefined): OurItem[] | undefined {
    const matches = [...(scriptText || '').matchAll(reFileItem)];
    if (!matches.length) {
        return undefined;
    }

    const items: OurItem[] = matches
        .map((m): OurItem => ({ dispname: m[1], duration: '', url: m[2] }))
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
