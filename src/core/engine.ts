import cheerio from '../cheerio/cheerio'; //import Cheerio from 'cheerio';
import path from 'path-browserify'; //import path from 'path';
import { pad2 } from '../utils/utils';
import { CourseInfo, reFileItem } from './content-match-regexes';

export interface Item {
    dispname: string;       // display name
    duration: string;       // video duration
    subtitle?: boolean;     // if true the srt file has the same name
    url: string;            // video URL
}

export interface ParseResult {
    items: Item[];          // Items on the page
    info: {                     // Collected information
        title?: string;         // Course title
        desc?: string;          // Course Description
        producerUrl?: string;   // Course producer URL
        producerName?: string;  // Course producer name
        preview?: string;       // Preview URL: "https://cdn.coursehunter.net/course/glubokie-osnovy-javascript-v2.jpg"
        site?: string;          // Course Hunter URL: "https://coursehunter.net/course/nodejs-polnoe-rukovodstvo"
        duration?: string;       // Course duration: '10:17:09'
        raw: Partial<CourseInfo.Description>; // Raw information from embedded script
    };
}

export function parseHtmlToItems(html: string): ParseResult {
    let $ = cheerio.load(html) as unknown as cheerio.Root;

    let rv: ParseResult = {
        items: [],
        info: {
            title: $('.hero-title').text(),
            desc: $('.hero-description').text(),
            producerUrl: $('.hero-source').children('a').attr('href'),   // if not found: undefined
            producerName: $('.hero-source').children('a').text(),        // if not found: empty string
            preview: $('meta[property="og:image"]').attr('content'),
            site: $('meta[property="og:url"]').attr('content'),
            duration: $($('.course-box-value').get(0)).text(),
            raw: getDescriptionJson($) || {},
        },
    };

    rv.info.raw.datePublished = convertTimeRuToLocal(rv.info.raw.datePublished);
    rv.info.raw.dateModified = convertTimeRuToLocal(rv.info.raw.dateModified);

    //console.log('date', convertTimeRuToLocal(rv.info.raw.dateModified));
    //console.log('courseInfo:', JSON.stringify(rv.info.raw, null, 4));

    let items: Item[] = scanForOldDefinitions($);

    if (!items) {
        let scripts = $('script').toArray() as unknown as cheerio.TagElement[];
        for (let script of scripts) {
            let isInlineScript = !Object.keys(script.attribs).length; // i.e. just <script> wo/ attributes, or we can check there is no attribute 'src'.
            if (isInlineScript) {
                let scriptText = script.children?.[0]?.data; // Note: script wo/ children[0].data is scr=URL.
                if ((items = handleScriptWithPlayerItems(scriptText))) {
                    break;
                }
            }
        }
    }

    items && (rv.items = items);
    return rv;

    function getDescriptionJson($: cheerio.Root): CourseInfo.Description | undefined {
        let scripts = $('script[type="application/ld+json"]').toArray() as unknown as cheerio.TagElement[];
        for (let script of scripts) {
            let text = script.children[0].data;
            let raw: CourseInfo.Description;
            try {
                raw = JSON.parse(text);
                raw = raw?.[0];
            } catch (error) {
            }
            if (raw) {
                return raw;
            }
        }
    }

    function convertTimeRuToLocal(dateStr: string | undefined): string {
        if (!dateStr) {
            return '';
        }
        let a = dateStr.split('-'); // yyyy-mm-dd
        if (a.length !== 3) {
            return '';
        }
        let date = new Date(Date.UTC(+a[0], +a[1] - 1, +a[2])); // y-m-d
        return date.toLocaleDateString('en-US', { year: '2-digit', day: '2-digit', month: '2-digit' }).replace(/\//g, '.');
    }

    function scanForOldDefinitions($: cheerio.Root): Item[] | undefined {
        let items: Item[] = [];
        $('.lessons-item').each((index, el) => {
            let mediaUrl = $('[itemprop=contentUrl]', el).attr('href');
            if (!mediaUrl) { // website updated on 08.23.20
                let script = (($('script', el) as unknown as cheerio.TagElement)?.[0]?.children[0] as any/*node.DataNode*/)?.data;
                let m = /"contentUrl":\s*"(https:\/\/[^"]+\.mp4)"/.exec(script);
                if (m) {
                    mediaUrl = m[1];
                }
            }
            items.push({
                dispname: $('.lessons-name', el).text(),
                duration: $('.lessons-duration', el).text(),
                url: mediaUrl,
            });
        });
        return items.length ? items : undefined;
    }

    function handleScriptWithPlayerItems(scriptText: string | undefined): Item[] | undefined {
        let matches = [...(scriptText || '').matchAll(reFileItem)];
        if (matches.length) {
            let items = matches.map((m: RegExpMatchArray) => ({dispname: m[1], duration: '', url: m[2]}));
            items = items.filter((_: Item) => !/sample.mp4/.test(_.url)); // Remove two commentes items.
            items.forEach((_: Item) => {
                // Correct name for each item
                const reTitleDuration = /^\d*\) #{0,1}([\.\d]+){0,1}\s*(.*) \| (.*)/;
                let match = _.dispname.match(reTitleDuration); // "1) #0 What&#039;s New In Framer Motion 2 | 00:04:15" or "1) 1.1. AE Basics | 00:31:36"
                if (match) {
                    _.dispname = match[2];
                    _.duration = match[3];

                    if (match[1]) { // '1.1.' -> '01.1'
                        let prefix = match[1];
                        let parts = prefix.split('.').filter(Boolean);
                        if (parts.length) {
                            parts[0] = pad2(+parts[0]);
                            prefix = parts.join('.');
                        }
                        _.dispname = `${prefix} - ${_.dispname}`;
                    }
                }
            });
            return items;
        }
    }

} //parseHtmlToItems()

export function getPlayerItemsUrl(html: string): string {
    const reAxiosItemsQuery = /\/course\/\d{3,10}?\/lessons/g;
    let m: RegExpExecArray | null = reAxiosItemsQuery.exec(html);
    return m ? `https://coursehunter.net${m[0]}` : '';
}

interface PlayerItem {          // items for build-in video player on the webpage
    id: string;                 // id: "c37871"
    file: string;               // remote file: "https://vss5.coursehunter.net/s/8f91140b938014446b02c00615768193/udemy-vueinfluencer/lesson1.mp4"
    subtitle: string;           // subtitle: "[English]https://vss5.coursehunter.net/udemy-vueinfluencer/lesson1.srt"
    title: string;              // title: "1 Introduction | 00:03:45"
}

export function parsePlayerItems(items: string) {
    let titleDuration = /([\s\S]+)\s*\|\s*(\d\d:\d\d:\d\d)$/;
    try {
        let json: PlayerItem[] = JSON.parse(items);
        let res = json.map((item: PlayerItem) => {
            // Strip title duration
            let m = titleDuration.exec(item.title);
            let title = m ? m[1] : item.title;
            let duration = m ? m[2] : '';
            // Make new item
            let newItem: Item = {
                dispname: title,
                duration: duration,
                subtitle: !!item.subtitle?.length,
                url: item.file,
            };
            return newItem;
        });
        return { items: res };
    } catch (error) {
        return { error };
    }
}

export type PersistentContent = {
    all: string;
    source: string;
    playerItems: string;
};

export function generatePersistentFileContent({all, source, playerItems}: PersistentContent) {
    let persistent =
`--------------------------------- 1 - player list ---------------------------------
${(all || '').trim()}
--------------------------------- 2 - source html ---------------------------------
${(source || '').trim()}
--------------------------------- 3 - source player items -------------------------
${(playerItems || '').trim()}
--------------------------------- 4 - end -----------------------------------------
`;
    return persistent;
}

export function parsePersistentFileContent(fileCnt: string): PersistentContent | undefined {
    /*
    Regex: -{33} \d - [^-]* -{10,}\r?\n(.*)
    Test:
        --------------------------------- 1 - player list ---------------------------------
        aaa
        --------------------------------- 2 - source html ---------------------------------
        bbb
        --------------------------------- 3 - source player items -------------------------
        cccc
        --------------------------------- 4 - end -----------------------------------------
    */
    const re = /-{33} \d - [^-]* -{10,}\r?\n/g;
    let m = fileCnt.split(re);
    if (m?.length >= 5) { // 0 and 4 elements are empty because we use split
        return {
            all: m[1],
            source: m[2],
            playerItems: m[3],
        }
    }
}

function generateHtml(templateHtml: string, items: Item[]) {
    let $ = cheerio.load(templateHtml);

    // Title
    let heroTitle = 'Video course';
    let title = $('.container');
    $(`<h3 class="main-title">TITLE ${heroTitle}</h3>`).insertBefore(title);

    const itemName = (index: number, name: string) => `${pad2(index + 1)} - ${name}`;
    const validateFname = (name) => {
        // Windows illegal: '\\/:*?"<>|'; or escaped /\\/:\*\?\"<>\|/
        return (name || '').trim().replace(/[\\\/:\*\?\"\<\>\|]/g, ';');
    };

    // List items
    let newText = '';
    items.forEach((item, index) => {
        newText +=
        `
        <li>
            <input type="text" value="${itemName(index, item.dispname)}" />
            <a href="${item.url}" tabindex="-1" target="blank" download="${item.url}" title="video ${index + 1}">
                <span>${item.duration}</span> mp4
            </a>
        </li>
        `;
    });
    let ul = $('.container>ul');
    ul.empty();
    ul.append(newText);

    // All together
    let textAll = items.reduce((acc, item, index) => acc += `${itemName(index, item.dispname)}\n`, '');
    let summary = $('.all-together');
    summary.text(textAll);
    summary.attr({rows: items.length + 1});

    // Batch rename files
    let textBatch = items.reduce((acc, item, index) => {
        let orgFname = path.basename(item.url);
        let orgExt = path.extname(orgFname);
        let newFname = validateFname(itemName(index, item.dispname));
        return acc += newFname ? `ren "${orgFname}" "${newFname}${orgExt}" \n` : '\n';
    }, 'chcp 1251\n');
    summary = $('.all-rename');
    summary.text(textBatch);
    summary.attr({rows: items.length + 2});

    // Done
    let html = $.html();
    return html;
}
