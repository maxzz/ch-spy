import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { cn } from "@/utils/classnames";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";

import { CLEAR_BUTTON_ID, clearSourceAtom, parseOrFetchAtom } from "../../store/a-actions";
import { buttonName_FetchOrParse_Atom } from "../../store/a-derived";
import { sourceInputAtom } from "../../store/a-local-storage-atoms";
import { itemsAtom, playerItemsUrlAtom } from "../../store/a-local-storage-state";

/** Row 1: Clear button, and the URL/HTML input with its Fetch or Parse button. */
export function Row1_SourceInput() {
    const [sourceInput, setSourceInput] = useAtom(sourceInputAtom);
    const items = useAtomValue(itemsAtom);
    const playerItemsUrl = useAtomValue(playerItemsUrlAtom);
    const buttonName_FetchOrParse = useAtomValue(buttonName_FetchOrParse_Atom);
    
    const clearSource = useSetAtom(clearSourceAtom);
    const parseOrFetch = useSetAtom(parseOrFetchAtom);

    return (
        <div className={cn('flex', !playerItemsUrl && items.length > 0 && 'mb-1')}>
            <Button
                className={cn("mr-2 transition-transform border border-foreground/30 rounded", !sourceInput && !items.length && "scale-x-0")}
                variant="outline"
                onClick={(event) => clearSource(event.ctrlKey)}
                title="Clear fetched data. Ctrl+Click clear player items as well"
                id={CLEAR_BUTTON_ID}
                tabIndex={-1}
                type="button"
            >
                Clear
            </Button>

            <div className="flex-1 flex overflow-hidden rounded bg-background border border-foreground/30 focus-within:ring-2 ring-offset-2 ring-purple-600 ring-offset-gray-200">
                <Input
                    className="flex-1 text-xs border-0 rounded-none focus-visible:ring-0"
                    value={sourceInput}
                    onChange={(event) => setSourceInput(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && sourceInput) {
                            parseOrFetch();
                        }
                    }}
                    placeholder="URL or HTML from coursehunter.net"
                    spellCheck={false}
                />

                <Button
                    variant="ghost"
                    className={cn(
                        "self-stretch h-auto rounded-none border-0 focus:ring-0 focus:shadow-none transition-all",
                        sourceInput ? "px-3 border-l border-foreground/30" : "w-0 px-0 overflow-hidden",
                    )}
                    onClick={() => parseOrFetch()}
                    tabIndex={-1}
                    type="button"
                >
                    {buttonName_FetchOrParse}
                </Button>
            </div>
        </div>
    );
}
