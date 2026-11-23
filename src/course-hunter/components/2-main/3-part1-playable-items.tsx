import { useAtomValue, useSetAtom } from 'jotai';
import { classNames } from '@/utils/classnames';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';

import { editableTitlesAtom, itemsAtom } from '../../store/a-local-storage-state';
import { itemNamesAtom } from '../../store/a-derived';
import { type OurItem } from '../../store/core/2-html-parse';
import { downloadStateFamily, startDownloadAtom } from '../../store/a-downloads';

export function Part_GeneratedItems() {
    const items = useAtomValue(itemsAtom);
    const names = useAtomValue(itemNamesAtom);

    return (
        <div className="bg-[#f1f1f1]">
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
        <li className="list-none hover:bg-[#90ff74] grid grid-cols-[1fr_min-content_min-content] gap-x-[0.6rem] items-center">
            {editable
                ? <Input className="p-[0.4rem] text-[0.9rem] leading-4 bg-[hsl(0_0%_100%/0.5)] focus:bg-[#90ff74] border border-[#fcfcfc] focus:outline-none rounded-xs cursor-default focus:cursor-text" defaultValue={name} />
                : <div className="pl-2 py-2 text-sm leading-tight hover:bg-[#ffffff80]">{name}</div>
            }

            <DownloadButton selectable={!editable} url={item.url} />

            <a
                className={classNames(
                    'select-none pr-[0.6rem] text-[0.7em] font-normal no-underline',
                    item.url ? 'text-[#1985ff] visited:text-[green]' : 'text-[red]',
                )}
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

function DownloadButton({ url, selectable }: { url: string; selectable: boolean; }) {
    const { tried, busy, progress, succeeded, failed } = useAtomValue(downloadStateFamily(url));
    const startDownload = useSetAtom(startDownloadAtom);

    return (
        <div className="relative">
            <Button
                variant="outline"
                className="py-0 h-6 text-sm"
                disabled={busy || !url}
                onClick={() => startDownload(url)}
                tabIndex={selectable ? undefined : -1}
                type="button"
            >
                Get
            </Button>

            {progress !== 0 && <div className="absolute top-0 right-0 w-[1.7em] p-[0.3em_0.5em] text-[0.7em] text-right text-[green] bg-[#ddd]">{progress}</div>}

            {tried && (
                <div className="relative h-[0.2em] bg-[rgb(209,255,198)] rounded-[0.2em] shadow-[inset_0_-1px_1px_rgba(255,255,255,0.3)]">
                    <span
                        className={classNames(
                            'relative h-full block',
                            failed ? 'bg-[red]' : 'bg-[rgb(43,194,83)]',
                            'rounded-l-[20px] rounded-r-[8px] shadow-[inset_0_2px_9px_rgba(255,255,255,0.3),inset_0_-2px_6px_rgba(0,0,0,0.4)] overflow-hidden',
                        )}
                        style={{ width: succeeded ? '100%' : `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
