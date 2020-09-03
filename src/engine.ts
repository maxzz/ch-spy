import cheerio from 'cheerio';
import path from 'path';
import { reFileItem } from './assets/content-match-regexes';

let heroTitle = 'Video course';

export function pad(n) {
    if (n < 10) {
        return `0${n}`;
    }
    return `${n}`;
}

export interface Item {
    title: string;
    duration: string;
    name: string;
    url: string;
}

export interface ParseResult {
    items: Item[];      // Items on the page
    title: string;      // Title in Russian
    desc: string;       // Description in English
    source: string;     // Page URL
}

export function htmlToItems(html: string): ParseResult {
    let $ = cheerio.load(html);

    const title = $('.hero-title').text();
    const desc = $('.hero-description').text();
    const source = $('.hero-source').text();

    let items: Item[] = [];

    $('.lessons-item').each((index, el) => {

        let mediaUrl = $('[itemprop=contentUrl]', el).attr('href');
        if (!mediaUrl) { // website updated on 08.23.20
            let script = $('script', el)[0].children[0].data;
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
                let scriptText = script.children[0].data;
                if (scriptText) {
                    let matches = [...scriptText.matchAll(reFileItem)];
                    if (matches.length) {
                        items = matches.map((m: RegExpMatchArray) => ({name: m[1], duration: '',  title: '??', url: m[2]}));
                        items = items.filter((_: Item) => !/sample.mp4/.test(_.url)); // remove two commentes items.
                        items.forEach((_: Item) => {
                            let match = _.name.match(/^\d*\) #\d+\s*(.*) \| (.*)/); // "1) #0 What&#039;s New In Framer Motion 2 | 00:04:15"
                            if (match) {
                                _.name= match[1];
                                _.duration = match[2];
                            }
                            
                            //console.log('match', match);
                        });

                        //console.log('matches', matches);
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

function generateHtml(templateHtml, items: Item[]) {
    let $ = cheerio.load(templateHtml);

    // Title
    let title = $('.container');
    $(`<h3 class="main-title">TITLE ${heroTitle}</h3>`).insertBefore(title);

    const itemName = (index, name) => `${pad(index + 1)} - ${name}`;
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
        let orgFname = path.basename(item.url);
        let orgExt = path.extname(orgFname);
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