import cheerio from 'cheerio';
import path from 'path';

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

export function htmlToItems(html: string): {items: Item[], title: string} {
    let $ = cheerio.load(html);

    heroTitle = $('.hero-title').text();

    let items: Item[] = [];

    $('.lessons-item').each((index, el) => {
        items.push({
            title: $('.lessons-title', el).text(),
            duration: $('.lessons-duration', el).text(),
            name: $('.lessons-name', el).text(),
            url: $('[itemprop=contentUrl]', el).attr('href'),
        });
    });

    return {
        items,
        title: heroTitle
    };
}

function generateHtml(template, items) {
    let $ = cheerio.load(template);

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

export function main(html: string): string {
    
    return '';
}
