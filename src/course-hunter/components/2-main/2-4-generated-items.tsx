import { useAtomValue, useSetAtom } from 'jotai';
import { classNames } from '@/utils/classnames';

import { editableTitlesAtom, itemsAtom } from '../../store/a-local-storage-state';
import { itemNamesAtom } from '../../store/a-derived';
import { type OurItem } from '../../store/core/2-html-parse';
import { downloadStateFamily, startDownloadAtom } from '../../store/a-downloads';

export function GeneratedItems() {
    const items = useAtomValue(itemsAtom);
    const names = useAtomValue(itemNamesAtom);

    return (
        <div className="ch-list bg-[#f1f1f1]">
            <ul>
                {items.map(
                    (item, index) => (
                        <GeneratedListItem key={`${index}:${names[index]}`} item={item} index={index} />
                    )
                )}
            </ul>
        </div>
    );
}

function GeneratedListItem({ item, index }: { item: OurItem; index: number; }) {
    const names = useAtomValue(itemNamesAtom);
    const editable = useAtomValue(editableTitlesAtom);
    const name = names[index];

    return (
        <li>
            {editable
                ? <input className="text-sm" defaultValue={name} />
                : <div className="pl-2 py-2 text-sm leading-tight hover:bg-[#ffffff80]">{name}</div>
            }

            <DownloadButton selectable={!editable} url={item.url} />

            <a
                className={`select-none ${item.url ? '' : 'ch-nolink'}`}
                href={item.url || undefined}
                title={`video ${index + 1}`}
                tabIndex={-1}
                target="blank"
            >
                <span>{item.duration}</span> mp4
            </a>
        </li>
    );
}

export function DownloadButton({ url, selectable }: { url: string; selectable: boolean; }) {
    const { tried, busy, progress, succeeded, failed } = useAtomValue(downloadStateFamily(url));
    const startDownload = useSetAtom(startDownloadAtom);

    return (
        <div className="relative">
            <button
                className="btn py-0 h-6 text-sm"
                disabled={busy || !url}
                onClick={() => startDownload(url)}
                tabIndex={selectable ? undefined : -1}
                type="button"
            >
                Get
            </button>

            {progress !== 0 && <div className="ch-progress">{progress}</div>}

            {tried && (
                <div className="ch-meter">
                    <span className={classNames(failed && 'ch-failed')} style={{ width: succeeded ? '100%' : `${progress}%` }} />
                </div>
            )}
        </div>
    );
}
