import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import path_browserify from 'path-browserify';
import * as OLD from './old/core/engine';
import * as NEW from '../src/course-hunter/store/core/engine';
import { buildBatchRenameFile, buildItemNames } from '../src/course-hunter/store/core/rename';

const fixtureDir = path.resolve(__dirname, '../src/course-hunter/core/fixtures');
const pageOld = fs.readFileSync(path.join(fixtureDir, 'page-old-lessons.html'), 'utf8');
const pagePlayerUrl = fs.readFileSync(path.join(fixtureDir, 'page-player-url.html'), 'utf8');

// Synthetic page: items embedded in an inline player script (not covered by the fixtures).
const scriptPage = `<html><head>
<meta property="og:image" content="https://cdn.example/x.jpg">
<meta property="og:url" content="https://coursehunter.net/course/x">
<script type="application/ld+json">[{"name":"X","datePublished":"2021-03-26","dateModified":"2021-03-27","description":"d"}]</script>
</head><body>
<div class="hero-title">Hero T</div><div class="hero-description">Desc</div>
<script>
 function PlayerjsAsync() {
   myPlayer = new Playerjs({ id: "player", file: [
    {"title": "1) 1.1. AE Basics | 00:31:36", "file": "https://vss4.coursehunter.net/s/a/mds-uianess/lesson1.mp4", "subtitle": "", "id": "c3315l1"},
    {"title": "2) 1.2. Render Tips | 00:09:40", "file": "https://vss4.coursehunter.net/s/b/mds-uianess/lesson2.mp4", "subtitle": "", "id": "c3315l2"},
    {"title": "3) #2 Enhanced Abstractions | 00:08:43", "file": "https://vss4.coursehunter.net/s/c/lut/lesson3.mp4", "subtitle": "[English]", "id": "c3315l3"},
    {"title": "0) sample | 00:00:01", "file": "https://plrjs.com/sample.mp4", "subtitle": "", "id": "s"}
   ] });
 }
</script>
</body></html>`;

// Items JSON as copied from the player items URL.
const playerItemsJson = JSON.stringify([
    { title: '1 О данном видео курсе | 00:09:28', file: 'https://vss3.coursehunter.net/s/8f/wfms/lesson1.mp4', subtitle: '[English]', id: 'c18781' },
    { title: '2 Что такое Node.js | 00:06:05', file: 'https://vss3.coursehunter.net/s/8e/wfms/lesson2.mp4', subtitle: '', id: 'c18782' },
    { title: 'No duration here', file: 'https://vss3.coursehunter.net/s/8d/wfms/lesson3.mp4', subtitle: '', id: 'c18783' },
]);

// ---- Old rename logic, copied verbatim from src/components/GeneratedList.vue ----
function oldNumberLength(n: number): number { return n < 10 ? 1 : n < 100 ? 2 : 3; }
function oldItemInputName(index: number, name: string, total: number): string {
    let m = /^(\d+)\s*-?\s*(.*)/.exec(name);
    let s = m && +m[1] === index + 1 ? m[2] : name;
    return `${String(index + 1).padStart(oldNumberLength(total), '0')} - ${s.trim()}`;
}
function oldValidateFname(name: string): string {
    let s = (name || '').trim();
    s = s.replace(/&#039;/g, "'");
    s = s.replace(/"/g, "'");
    s = s.replace(/[\\\/:\*\?\"\<\>\|]/g, ';');
    return s;
}
function oldAllTogether(items: OLD.Item[]): string {
    return items.reduce((acc, item, index) => acc += `${oldItemInputName(index, item.dispname, items.length)}\n`, '');
}
function oldBatch(items: OLD.Item[]): string {
    let subtitles = [];
    let s: string = items.reduce((acc, item, index) => {
        let orgFname = path_browserify.basename(item.url);
        let orgExt = path_browserify.extname(orgFname);
        let orgWoExt = orgFname.replace(/\.[^/.]+$/, '');
        let newFname = oldValidateFname(oldItemInputName(index, item.dispname, items.length));
        newFname && subtitles.push(`ren "${orgWoExt}.srt" "${newFname}.srt"`);
        acc += newFname ? `ren "${orgFname}" "${newFname}${orgExt}" \n` : '\n';
        return acc;
    }, 'chcp 1251\n');
    if (subtitles.length) {
        s = `${s}\n${subtitles.join('\n')}\n`;
    }
    return s;
}

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

describe('parity: parseHtmlToItems', () => {
    for (const [name, html] of [['old-lessons page', pageOld], ['player-url page', pagePlayerUrl], ['script page', scriptPage]] as const) {
        it(name, () => {
            const o = OLD.parseHtmlToItems(html);
            const n = NEW.parseHtmlToItems(html);
            console.log(name, '-> items:', o.items.length, 'title:', JSON.stringify(o.info.title), 'duration:', o.info.duration, 'raw.keys:', Object.keys(o.info.raw).length);
            expect(clone(n)).toEqual(clone(o));
            expect(n).toEqual(o);
        });
    }
});

describe('parity: player url', () => {
    for (const [name, html] of [['old-lessons page', pageOld], ['player-url page', pagePlayerUrl], ['script page', scriptPage]] as const) {
        it(name, () => {
            expect(NEW.getPlayerItemsUrl(html)).toBe(OLD.getPlayerItemsUrl(html));
        });
    }
});

describe('parity: parsePlayerItems', () => {
    it('same items', () => {
        const o = OLD.parsePlayerItems(playerItemsJson) as { items: OLD.Item[] };
        const n = NEW.parsePlayerItems(playerItemsJson);
        expect(n.ok).toBe(true);
        expect(n.ok && n.items).toEqual(o.items);
    });
    it('same error for invalid JSON', () => {
        const o = OLD.parsePlayerItems('{not json') as { error: unknown };
        const n = NEW.parsePlayerItems('{not json');
        expect(n.ok).toBe(false);
        expect(!n.ok && `${n.error}`).toBe(`${o.error}`);
    });
});

describe('parity: persistent file format', () => {
    const content = { all: '01 - A\n02 - B\n', source: '<html>x</html>', playerItems: playerItemsJson };
    it('generate', () => {
        expect(NEW.generatePersistentFileContent(content)).toBe(OLD.generatePersistentFileContent(content));
    });
    it('parse', () => {
        const text = OLD.generatePersistentFileContent(content);
        expect(NEW.parsePersistentFileContent(text)).toEqual(OLD.parsePersistentFileContent(text));
        expect(NEW.parsePersistentFileContent('nothing here')).toEqual(OLD.parsePersistentFileContent('nothing here'));
    });
});

describe('parity: rename files', () => {
    for (const [name, html] of [['old-lessons page', pageOld], ['script page', scriptPage], ['player items', null]] as const) {
        it(name, () => {
            const items = html ? NEW.parseHtmlToItems(html).items : NEW.parsePlayerItems(playerItemsJson).ok ? (NEW.parsePlayerItems(playerItemsJson) as { items: NEW.Item[] }).items : [];
            const oldItems = items.map((i) => ({ ...i })) as OLD.Item[];
            if (!items.length) throw new Error('no items for ' + name);
            expect(buildItemNames(items)).toEqual(oldItems.map((_, i) => oldItemInputName(i, oldItems[i].dispname, oldItems.length)));
            expect(buildBatchRenameFile(items)).toBe(oldBatch(oldItems));
            const allTogether = buildItemNames(items).map((n) => `${n}\n`).join('');
            expect(allTogether).toBe(oldAllTogether(oldItems));
            console.log(name, 'batch preview:\n' + buildBatchRenameFile(items).split('\n').slice(0, 4).join('\n'));
        });
    }
});

describe('sanity: old page fixture has items with urls', () => {
    it('no undefined urls', () => {
        const items = NEW.parseHtmlToItems(pageOld).items;
        console.log('first items:', JSON.stringify(items.slice(0, 2), null, 1));
    });
});
