import Cheerio from '../cheerio/cheerio'; //import Cheerio from 'cheerio';
import path from 'path-browserify'; //import path from 'path';
import { reFileItem } from './content-match-regexes';
import jsDownloader from 'js-file-downloader';

let heroTitle = 'Video course';

export function pad2(n: number): string {
    if (n < 10) {
        return `0${n}`;
    }
    return `${n}`;
}

export interface Item {
    titleOld: string;    // not really used ( it was $('.lessons-title', el).text(), but not used )
    duration: string;    // video duration
    dispname: string;    // display name
    url: string;         // video URL
    //srt?: string;      // closed captions; was not used
    subtitle?: boolean;  // if true the srt file has the same name
}

export interface ParseResult {
    items: Item[];       // Items on the page
    title: string;       // Title in Russian
    desc: string;        // Description in English
    source: string;      // Page URL
}

export function parseHtmlToItems(html: string): ParseResult {
    let $ = Cheerio.load(html);

    //<meta property="og:image" content="https://cdn.coursehunter.net/course/glubokie-osnovy-javascript-v2.jpg">

    const title = $('.hero-title').text();
    const desc = $('.hero-description').text();
    const source = $('.hero-source').text();

    let items: Item[] = [];
    
    $('.lessons-item').each((index, el) => {

        let mediaUrl = $('[itemprop=contentUrl]', el).attr('href');
        if (!mediaUrl) { // website updated on 08.23.20
            let script = ($('script', el)[0].children[0] as any/*node.DataNode*/).data;
            let m = /"contentUrl":\s*"(https:\/\/[^"]+\.mp4)"/.exec(script);
            if (m) {
                mediaUrl = m[1];
            }
        }

        items.push({
            titleOld: $('.lessons-title', el).text(),
            duration: $('.lessons-duration', el).text(),
            dispname: $('.lessons-name', el).text(),
            url: mediaUrl,
        });
    });

    function handleScriptWithPlayerItems(scriptText: string): Item[] | undefined {
        let matches = [...scriptText.matchAll(reFileItem)];
        if (matches.length) {
            let items = matches.map((m: RegExpMatchArray) => ({dispname: m[1], duration: '',  titleOld: '??', url: m[2]}));
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

    if (!items.length) {
        let scripts = $('script');
        for (let script of scripts.toArray()) {
            if (!Object.keys(script.attribs).length) { // i.e. just <script> wo/ attributes, or we can check there is no attribute 'src'.
                let scriptText = (script as any/*cheerio.TagElement*/).children[0].data as string; // Note: script wo/ children[0].data is scr=URL.
                if (scriptText) {
                    items = handleScriptWithPlayerItems(scriptText);
                    if (items) {
                        break;
                    }
                }
            }
        }
    }

    return {
        items: items || [],
        title,
        desc,
        source,
    };
}

export function getPlayerItemsUrl(html: string): string {
    const reAxiosItemsQuery = /\/course\/\d{3,10}?\/lessons/g;
    let m: RegExpExecArray = reAxiosItemsQuery.exec(html);
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
                titleOld: title,
                duration: duration,
                url: item.file,
                dispname: title,
            };
            return newItem;
        });
        return { items: res };
    } catch (error) {
        return { error };
    }
}

export async function downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    try {
        await new jsDownloader({ url, filename });
    } catch (error) {
        console.log('error', error);
        return { error };
    } finally {
        console.log('clean');
        URL.revokeObjectURL(url);
    }
    console.log('done');
    return { success: true };
}

export function generatePersistentFileContent(allItems: string, allSource: string) {
    let persistent = 
`--------------------------------- 1 - player list ---------------------------------
${(allItems || '').trim()}
--------------------------------- 2 - source html ---------------------------------
${(allSource || '').trim()}
--------------------------------- 3 - end -----------------------------------------
`;
    return persistent;
}

function generateHtml(templateHtml: string, items: Item[]) {
    let $ = Cheerio.load(templateHtml);

    // Title
    let title = $('.container');
    $(`<h3 class="main-title">TITLE ${heroTitle}</h3>`).insertBefore(title);

    const itemName = (index, name) => `${pad2(index + 1)} - ${name}`;
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
