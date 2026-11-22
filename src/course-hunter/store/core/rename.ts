import path from 'path-browserify';
import type { Item } from './engine';

//---------------------------------------------------------------------------

export function buildItemNames(items: Item[]): string[] {
    return items.map(
        (item, index) => itemInputName(index, item.dispname, items.length)
    );
}

//---------------------------------------------------------------------------

/** Windows batch file (chcp 1251) with `ren` commands that rename downloaded videos and their .srt subtitles. */
export function buildBatchRenameFile(items: Item[]): string {
    const subtitles: string[] = [];
    let s = 'chcp 1251\n'; // TODO: If filename is utf8 encoded then it is a problem. see https://coursehunter.net/course/ci-cd-na-primere-gitlab-ci

    items.forEach((item, index) => {
        const orgFname = path.basename(item.url ?? '');
        const orgExt = path.extname(orgFname);
        const orgWoExt = orgFname.replace(/\.[^/.]+$/, '');
        const newFname = validateFname(itemInputName(index, item.dispname, items.length));
        if (newFname) {
            subtitles.push(`ren "${orgWoExt}.srt" "${newFname}.srt"`);
            s += `ren "${orgFname}" "${newFname}${orgExt}" \n`;
        } else {
            s += '\n';
        }
    });

    if (subtitles.length) {
        s = `${s}\n${subtitles.join('\n')}\n`;
    }
    return s;
}

/** Makes a string safe to use as a Windows file name. */
export function validateFname(name: string): string {
    let s = (name || '').trim();
    s = s.replace(/&#039;/g, "'");
    s = s.replace(/"/g, "'");
    s = s.replace(/[\\\/:\*\?\"\<\>\|]/g, ';'); // Windows illegals: '\\/:*?"<>|'
    return s;
}

//---------------------------------------------------------------------------

/**
 * Display name of an item in the list: "01 - Name".
 * A leading index that already equals the item position is removed first, so names are not numbered twice.
 */
export function itemInputName(index: number, name: string, total: number): string {
    const m = /^(\d+)\s*-?\s*(.*)/.exec(name);
    const s = m && +m[1] === index + 1 ? m[2] : name;
    return `${String(index + 1).padStart(numberLength(total), '0')} - ${s.trim()}`;
}

function numberLength(n: number): number {
    return n < 10 ? 1 : n < 100 ? 2 : 3;
}
