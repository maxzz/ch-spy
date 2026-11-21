import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    generatePersistentFileContent,
    getPlayerItemsUrl,
    parseHtmlToItems,
    parsePersistentFileContent,
    parsePlayerItems,
} from './engine';
import { buildBatchRenameFile, buildItemNames, itemInputName, validateFname } from './rename';
import { isSourceUrl, parseCopiedState, patchFromHtml, patchFromStorage, NOTHING_DETECTED } from './session';

const fixture = (name: string) => fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8');

const lessonsPage = fixture('page-old-lessons.html');   // lessons are listed in the page (.lessons-item)
const playerUrlPage = fixture('page-player-url.html');  // lessons are loaded from /course/<id>/lessons

const playerItemsJson = JSON.stringify([
    { title: '1 О данном видео курсе | 00:09:28', file: 'https://vss3.coursehunter.net/s/8f/wfms/lesson1.mp4', subtitle: '[English]', id: 'c18781' },
    { title: '2 Что такое Node.js | 00:06:05', file: 'https://vss3.coursehunter.net/s/8e/wfms/lesson2.mp4', subtitle: '', id: 'c18782' },
    { title: 'No duration here', file: 'https://vss3.coursehunter.net/s/8d/wfms/lesson3.mp4', subtitle: '', id: 'c18783' },
]);

// Page where the items are in an inline player script.
const scriptPage = `<html><head>
<meta property="og:url" content="https://coursehunter.net/course/x">
</head><body>
<div class="hero-title">Hero title</div>
<script>
  new Playerjs({ id: "player", file: [
    {"title": "1) 1.1. AE Basics | 00:31:36", "file": "https://vss4.coursehunter.net/s/a/mds/lesson1.mp4", "subtitle": "", "id": "c1"},
    {"title": "2) #2 Enhanced Abstractions | 00:08:43", "file": "https://vss4.coursehunter.net/s/c/lut/lesson2.mp4", "subtitle": "[English]", "id": "c2"},
    {"title": "0) sample | 00:00:01", "file": "https://plrjs.com/sample.mp4", "subtitle": "", "id": "s"}
  ] });
</script>
</body></html>`;

describe('parseHtmlToItems', () => {
    it('reads the lesson list and course info from a page with lessons', () => {
        const { items, info } = parseHtmlToItems(lessonsPage);

        expect(items).toHaveLength(48);
        expect(items[0].url).toMatch(/^https:\/\/.+\.mp4$/);
        expect(items[0].dispname).not.toBe('');
        expect(info.title).toBe('Полное введение в Linux и командную строку');
        expect(info.raw.datePublished).toMatch(/^\d{2}\.\d{2}\.\d{2}$/);
    });

    it('returns no items when the lessons are loaded from a separate URL', () => {
        const { items } = parseHtmlToItems(playerUrlPage);
        expect(items).toEqual([]);
        expect(getPlayerItemsUrl(playerUrlPage)).toMatch(/^https:\/\/coursehunter\.net\/course\/\d+\/lessons$/);
    });

    it('reads items embedded in an inline player script and skips sample.mp4', () => {
        const { items, info } = parseHtmlToItems(scriptPage);

        expect(info.title).toBe('Hero title');
        expect(info.site).toBe('https://coursehunter.net/course/x');
        expect(items.map((i) => i.duration)).toEqual(['00:31:36', '00:08:43']);
        expect(items[0].dispname).toBe('01.1 - AE Basics');
        expect(items[1].dispname).toBe('02 - Enhanced Abstractions');
    });
});

describe('parsePlayerItems', () => {
    it('strips the duration from titles and maps the subtitle flag', () => {
        const res = parsePlayerItems(playerItemsJson);
        expect(res.ok).toBe(true);
        if (!res.ok) return;

        expect(res.items).toEqual([
            { dispname: '1 О данном видео курсе ', duration: '00:09:28', subtitle: true, url: 'https://vss3.coursehunter.net/s/8f/wfms/lesson1.mp4' },
            { dispname: '2 Что такое Node.js ', duration: '00:06:05', subtitle: false, url: 'https://vss3.coursehunter.net/s/8e/wfms/lesson2.mp4' },
            { dispname: 'No duration here', duration: '', subtitle: false, url: 'https://vss3.coursehunter.net/s/8d/wfms/lesson3.mp4' },
        ]);
    });

    it('reports invalid JSON as an error', () => {
        const res = parsePlayerItems('{not json');
        expect(res.ok).toBe(false);
    });
});

describe('persistent file format', () => {
    it('round-trips the sections', () => {
        const content = { all: '01 - A\n02 - B\n', source: '<html>page</html>', playerItems: playerItemsJson };
        const text = generatePersistentFileContent(content);
        // Each section keeps the newline that ends it (same as the previous app).
        expect(parsePersistentFileContent(text)).toEqual({
            all: '01 - A\n02 - B\n',
            source: '<html>page</html>\n',
            playerItems: `${playerItemsJson}\n`,
        });
    });

    it('returns undefined for text without the section headers', () => {
        expect(parsePersistentFileContent('just some text')).toBeUndefined();
    });
});

describe('rename helpers', () => {
    it('numbers names with zero padding that matches the list length', () => {
        expect(itemInputName(0, 'Intro', 3)).toBe('1 - Intro');
        expect(itemInputName(0, 'Intro', 48)).toBe('01 - Intro');
        expect(itemInputName(99, 'Outro', 120)).toBe('100 - Outro');
    });

    it('does not number an item twice when its name already starts with the same index', () => {
        expect(itemInputName(1, '2 - Second', 5)).toBe('2 - Second');
        expect(itemInputName(1, '7 - Other', 5)).toBe('2 - 7 - Other');
    });

    it('replaces characters that are illegal in Windows file names', () => {
        expect(validateFname(' a "b" c/d:e*f?g<h>i|j&#039;k ')).toBe("a 'b' c;d;e;f;g;h;i;j'k");
    });

    it('builds the batch rename file with subtitle renames', () => {
        const items = parseHtmlToItems(scriptPage).items;
        const batch = buildBatchRenameFile(items);

        expect(batch.startsWith('chcp 1251\n')).toBe(true);
        expect(batch).toContain('ren "lesson1.mp4" "1 - .1 - AE Basics.mp4" \n');
        expect(batch).toContain('ren "lesson2.mp4" "2 - Enhanced Abstractions.mp4" \n');
        expect(batch).toContain('\nren "lesson1.srt" "1 - .1 - AE Basics.srt"\nren "lesson2.srt" "2 - Enhanced Abstractions.srt"\n');
    });

    it('lists item names in order', () => {
        const items = parseHtmlToItems(scriptPage).items;
        expect(buildItemNames(items)).toEqual(['1 - .1 - AE Basics', '2 - Enhanced Abstractions']);
    });
});

describe('session patches', () => {
    it('detects a URL', () => {
        expect(isSourceUrl('https://coursehunter.net/course/x')).toBe(true);
        expect(isSourceUrl('<html>')).toBe(false);
    });

    it('sets the player items URL when the page has none of its own items', () => {
        const patch = patchFromHtml(playerUrlPage);
        expect(patch.items).toEqual([]);
        expect(patch.playerItemsUrl).toMatch(/\/lessons$/);
        expect(patch.error).toBe('');
    });

    it('reports nothing detected for a page without lessons', () => {
        expect(patchFromHtml('<html></html>').error).toBe(NOTHING_DETECTED);
    });

    it('restores a copied state (page + player items) from storage', () => {
        const copied = JSON.stringify({
            a: 'tm',
            docurl: 'https://coursehunter.net/course/x',
            itemsurl: 'https://coursehunter.net/course/1/lessons',
            doc: lessonsPage,
            items: playerItemsJson,
        });

        expect(parseCopiedState(copied)?.itemsurl).toBe('https://coursehunter.net/course/1/lessons');

        const patch = patchFromStorage(copied, playerItemsJson);
        expect(patch.playerItemsUrl).toBe('https://coursehunter.net/course/1/lessons');
        expect(patch.items).toHaveLength(3);   // the player items win over the page items
    });

    it('does not re-fetch a stored URL on startup', () => {
        const patch = patchFromStorage('https://coursehunter.net/course/x', '');
        expect(patch).toEqual({});
    });
});
