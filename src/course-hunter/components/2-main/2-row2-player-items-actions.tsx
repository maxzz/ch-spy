import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { classNames } from "@/utils/classnames";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";

import { playerItemsUrlAtom } from "../../store/a-local-storage-state";
import { clearPlayItemsAtom, parsePlayerItemsAtom } from "../../store/a-actions";
import { playerItemsJsonAtom } from "../../store/a-local-storage-atoms";

/** Row 2: the player items URL to open, and the input for the JSON copied from it. Hidden when there is no URL. */
export function Row2_PlayerItemsActions() {
    const [playerItemsJson, setPlayerItemsJson] = useAtom(playerItemsJsonAtom);
    const playerItemsUrl = useAtomValue(playerItemsUrlAtom);
    const parsePlayerItems = useSetAtom(parsePlayerItemsAtom);
    const clearPlayItems = useSetAtom(clearPlayItemsAtom);

    if (playerItemsUrl === '') {
        return null;
    }

    return (
        <div>
            <div className="mb-2 text-sm flex">
                <a className={classNames(btnClasses, "mr-1 text-xs")} href={playerItemsUrl} target="_blank" rel="noreferrer">
                    Get items from:
                </a>

                <Button variant="outline" className="ml-0.5 mr-1.5 text-xs" onClick={() => clearPlayItems()} type="button">
                    Clear
                </Button>

                <a className="text-xs flex items-center underline" href={playerItemsUrl} target="_blank" rel="noreferrer">
                    {playerItemsUrl}
                </a>
            </div>

            <div className="flex">
                <Input
                    className="flex-1 text-xs focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 focus:ring-offset-gray-200 outline-none"
                    value={playerItemsJson}
                    onChange={(event) => setPlayerItemsJson(event.target.value)}
                    onKeyDown={(event) => { if (event.key === 'Enter') { parsePlayerItems(); } }}
                    placeholder="Copy and paste items from url above"
                    spellCheck={false}
                />

                {playerItemsJson && (
                    <Button variant="outline" className="ml-1.5" onClick={() => parsePlayerItems()} type="button">
                        Parse
                    </Button>
                )}
            </div>

        </div>
    );
}

const btnClasses = "\
px-2 py-1 text-sm leading-normal \
border \
rounded-sm \
bg-gray-200 \
text-gray-900 \
border-gray-500 \
hover:bg-gray-300 \
active:scale-105 \
focus:outline-none \
focus:ring-offset-1 \
focus:ring-2 \
select-none \
ring-purple-600 \
ring-offset-gray-200 \
";
