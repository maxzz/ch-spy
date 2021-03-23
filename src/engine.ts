import Cheerio from 'cheerio';
//import path from 'path';
import path2 from 'path-browserify';
import { reAxiosItemsQuery, reFileItem } from './assets/content-match-regexes';

let heroTitle = 'Video course';

export function pad2(n: number): string {
    if (n < 10) {
        return `0${n}`;
    }
    return `${n}`;
}

export interface Item {
    title: string;      // not really used ( it was $('.lessons-title', el).text(), but not used )
    duration: string;   // video duration
    name: string;       // display name
    url: string;        // video URL
    srt?: string;       // close captions
}

export interface ParseResult {
    items: Item[];      // Items on the page
    title: string;      // Title in Russian
    desc: string;       // Description in English
    source: string;     // Page URL
}

export function htmlToItems(html: string): ParseResult {
    let $ = Cheerio.load(html);

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
            title: $('.lessons-title', el).text(),
            duration: $('.lessons-duration', el).text(),
            name: $('.lessons-name', el).text(),
            url: mediaUrl,
        });
    });

    if (!items.length) {
        let scripts = $('script');

        for (let script of scripts.toArray()) {
            if (!Object.keys(script.attribs).length) { // i.e. just <script> wo/ attributes
                let scriptText = (script as any/*cheerio.TagElement*/).children[0].data;
                if (scriptText) {
                    let matches = [...scriptText.matchAll(reFileItem)];
                    if (matches.length) {
                        items = matches.map((m: RegExpMatchArray) => ({name: m[1], duration: '',  title: '??', url: m[2]}));
                        items = items.filter((_: Item) => !/sample.mp4/.test(_.url)); // remove two commentes items.
                        items.forEach((_: Item) => {
                            let match = _.name.match(/^\d*\) #{0,1}([\.\d]+){0,1}\s*(.*) \| (.*)/); // "1) #0 What&#039;s New In Framer Motion 2 | 00:04:15" or "1) 1.1. AE Basics | 00:31:36"
                            if (match) {
                                _.name = match[2];
                                _.duration = match[3];

                                if (match[1]) { // '1.1.' -> '01.1'
                                    let prefix = match[1];
                                    let parts = prefix.split('.').filter(Boolean);
                                    if (parts.length) {
                                        parts[0] = pad2(+parts[0]);
                                        prefix = parts.join('.');
                                    }
                                    _.name = `${prefix} - ${_.name}`;
                                }
                            }
                        });
                    }
                }
            }
        }

        //console.log('items', items);
    }

    return {
        items,
        title,
        desc,
        source,
    };
}

export function getAxiosItemsLink(html: string): string {
    let m: RegExpExecArray = reAxiosItemsQuery.exec(html);
    return m ? `https://coursehunter.net${m[0]}` : '';
}

export interface PlayerItem {   // items for build-in video player on the webpage
    id: string;                 // id: "c37871"
    file: string;               // file: "https://vss5.coursehunter.net/s/8f91140b938014446b02c00615768193/udemy-vueinfluencer/lesson1.mp4"
    subtitle: string;           // subtitle: "[English]https://vss5.coursehunter.net/udemy-vueinfluencer/lesson1.srt"
    title: string;              // title: "1 Introduction | 00:03:45"
}

export function parsePlayerItems(items: string) {
    let re = /([\s\S]+)\s*\|\s*(\d\d:\d\d:\d\d)$/;
    try {
        let json: PlayerItem[] = JSON.parse(items);
        console.log({json});
        let res = json.map((item: PlayerItem) => {
            let m = re.exec(item.title);
            let title = m ? m[1] : item.title;
            let duration = m ? m[2] : '';
            let newItem: Item = {
                title: title,
                duration: duration,
                url: item.file,
                name: title,
            };
            return newItem;
        });
        return { items: res };
    } catch (error) {
        return { error: `Error: ${error}` };
    }
};


function generateHtml(templateHtml, items: Item[]) {
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
            <input type="text" value="${itemName(index, item.name)}" />
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
    let textAll = items.reduce((acc, item, index) => acc += `${itemName(index, item.name)}\n`, '');
    let summary = $('.all-together');
    summary.text(textAll);
    summary.attr({rows: items.length + 1});

    // Batch rename files
    let textBatch = items.reduce((acc, item, index) => {
        let orgFname = path2.basename(item.url);
        let orgExt = path2.extname(orgFname);
        let newFname = validateFname(itemName(index, item.name));
        return acc += newFname ? `ren "${orgFname}" "${newFname}${orgExt}" \n` : '\n';
    }, 'chcp 1251\n');
    summary = $('.all-rename');
    summary.text(textBatch);
    summary.attr({rows: items.length + 2});

    // Done
    let html = $.html();
    return html;
}
