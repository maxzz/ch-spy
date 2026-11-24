import { useAtomValue, useSetAtom } from "jotai";
import { Download } from "lucide-react";
import { classNames } from "@/utils/classnames";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";

import { editableTitlesAtom, itemsAtom } from "../../store/a-local-storage-state";
import { durationBarsAtom, itemNamesAtom } from "../../store/a-derived";
import { type OurItem } from "../../store/core/2-html-parse";
import { downloadStateFamily, startDownloadAtom } from "../../store/a-downloads";

export function Part_GeneratedItems() {
    const items = useAtomValue(itemsAtom);
    const names = useAtomValue(itemNamesAtom);

    return (
        <div className="bg-background">
            <ul>
                {items.map(
                    (item, index) => (
                        <Row key={`${index}:${names[index]}`} item={item} index={index} />
                    )
                )}
            </ul>
        </div>
    );
}

function Row({ item, index }: { item: OurItem; index: number; }) {
    const names = useAtomValue(itemNamesAtom);
    const editable = useAtomValue(editableTitlesAtom);
    const bars = useAtomValue(durationBarsAtom);
    const name = names[index];
    const bar = bars[index] ?? { left: 0, width: 0 };

    return (
        <li className="list-none hover:bg-[#90ff74] grid grid-cols-[1fr_min-content_min-content] gap-x-2 items-center">
            {/* Title */}
            {editable
                ? (
                    <Input
                        className="h-7 px-2 py-0.5 text-xs leading-4 focus:bg-[#90ff74] border border-foreground/10 focus:outline-none rounded-none cursor-default focus:cursor-text"
                        defaultValue={name}
                    />
                )
                : (
                    <div className="h-7 pl-2 py-1.5 text-xs leading-tight hover:bg-[#ffffff80]">
                        {name}
                    </div>
                )
            }

            <ButtonGetAsDownload selectable={!editable} url={item.url} />

            <a
                className={classNames("flex flex-col select-none pr-2 text-[0.65rem] font-normal no-underline", item.url ? "text-[#1985ff] visited:text-[green]" : "text-[red]")}
                href={item.url || undefined}
                title={`video ${index + 1}`}
                tabIndex={-1}
                target="blank"
            >
                <span className="mt-px">
                    {item.duration}
                </span>

                <div className="relative mt-[0.5px] h-0.5 bg-[rgb(209,229,255)] rounded">
                    <span
                        className="absolute top-0 h-full bg-[#1985ff] rounded"
                        style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
                    />
                </div>
            </a>
        </li>
    );
}

function ButtonGetAsDownload({ url, selectable }: { url: string; selectable: boolean; }) {
    const { tried, busy, progress, succeeded, failed } = useAtomValue(downloadStateFamily(url));
    const startDownload = useSetAtom(startDownloadAtom);

    return (
        <div className="relative">
            <Button
                className="h-5 px-1 text-[0.65rem] font-normal bg-muted border border-foreground/10 rounded"
                variant="outline"
                disabled={busy || !url}
                onClick={() => startDownload(url)}
                tabIndex={selectable ? undefined : -1}
                title="Download"
                type="button"
            >
                <Download className="size-2.5" />
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
