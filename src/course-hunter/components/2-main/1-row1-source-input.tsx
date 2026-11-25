import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { cn } from "@/utils/classnames";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Copy, X } from "lucide-react";

import { CLEAR_BUTTON_ID, clearSourceAtom, parseOrFetchAtom } from "../../store/a-actions";
import { buttonName_FetchOrParse_Atom } from "../../store/a-derived";
import { sourceInputAtom } from "../../store/a-local-storage-atoms";
import { itemsAtom, playerItemsUrlAtom } from "../../store/a-local-storage-state";

/** Row 1: URL/HTML input with Clear and Copy buttons inside, and the Fetch or Parse button. */
export function Row1_SourceInput() {
    const [sourceInput, setSourceInput] = useAtom(sourceInputAtom);
    const items = useAtomValue(itemsAtom);
    const playerItemsUrl = useAtomValue(playerItemsUrlAtom);
    const buttonName_FetchOrParse = useAtomValue(buttonName_FetchOrParse_Atom);

    const clearSource = useSetAtom(clearSourceAtom);
    const parseOrFetch = useSetAtom(parseOrFetchAtom);

    const hasClearable = !!sourceInput || items.length > 0;

    return (
        <div className={cn("flex", !playerItemsUrl && items.length > 0 && 'mb-1')}>
            <div className="flex-1 bg-background focus-within:ring-2 border border-foreground/30 ring-offset-0 ring-blue-400 ring-offset-gray-200 rounded overflow-hidden flex">
                <Input
                    className="flex-1 text-[0.75rem] focus-visible:ring-0 border-0 rounded-none"
                    value={sourceInput}
                    onChange={(event) => setSourceInput(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && sourceInput) {
                            parseOrFetch();
                        }
                    }}
                    placeholder="Enter HTML or URL from coursehunter.net website"
                    spellCheck={false}
                />

                {/* Clear, and Copy buttons */}

                <Button
                    variant="ghost"
                    className={cn(
                        "self-stretch h-auto p-2 focus:ring-0 focus:shadow-none transition-all border-0 rounded hover:text-red-600",
                        hasClearable ? "" : "w-0 px-0 overflow-hidden",
                    )}
                    onClick={(event) => clearSource(event.ctrlKey)}
                    title="Clear fetched data. Ctrl+Click clear player items as well"
                    id={CLEAR_BUTTON_ID}
                    tabIndex={-1}
                    type="button"
                >
                    <X className="size-3" />
                </Button>

                <Button
                    variant="ghost"
                    className={cn(
                        "self-stretch mr-4 h-auto px-2 focus:ring-0 focus:shadow-none transition-all border-0 rounded-none",
                        sourceInput ? "" : "w-0 px-0 overflow-hidden",
                    )}
                    onClick={() => navigator.clipboard.writeText(sourceInput)}
                    title="Copy to clipboard"
                    tabIndex={-1}
                    type="button"
                >
                    <Copy className="size-3" />
                </Button>

                {/* Fetch or Parse button */}

                <Button
                    variant="ghost"
                    className={cn(
                        "self-stretch h-auto focus:ring-0 focus:shadow-none transition-all border-0 rounded-none",
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
