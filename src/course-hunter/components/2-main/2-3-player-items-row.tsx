import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { cx } from '../../../utils/lib/classnames';
import { clearPlayItemsAtom, parsePlayerItemsAtom } from '../../store/a-actions';
import { playerItemsJsonAtom } from '../../store/a-local-storage-atoms';
import { itemsAtom, playerItemsUrlAtom } from '../../store/a-local-storage-state';

/** Row 2: the player items URL to open, and the input for the JSON copied from it. Hidden when there is no URL. */
export function PlayerItemsRow() {
    const [playerItemsJson, setPlayerItemsJson] = useAtom(playerItemsJsonAtom);
    const playerItemsUrl = useAtomValue(playerItemsUrlAtom);
    const items = useAtomValue(itemsAtom);
    const parsePlayerItems = useSetAtom(parsePlayerItemsAtom);
    const clearPlayItems = useSetAtom(clearPlayItemsAtom);

    if (playerItemsUrl === '') {
        return null;
    }

    return (
        <div
            className={cx('transition-transform duration-1000', items.length > 0 && '-translate-x-28 -translate-y-6 scale-50')}
        >
            <div className="mt-4 mb-2 text-sm flex">
                <a className="btn mr-1 text-xs" href={playerItemsUrl} target="_blank" rel="noreferrer">
                    Get items from:
                </a>
                <button className="btn ml-0.5 mr-1.5 text-xs" onClick={() => clearPlayItems()} type="button">
                    Clear
                </button>
                <a className="text-xs flex items-center underline" href={playerItemsUrl} target="_blank" rel="noreferrer">
                    {playerItemsUrl}
                </a>
            </div>

            <div className="flex">
                <input
                    className="text-xs focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 focus:ring-offset-gray-200 outline-none flex-1 input"
                    value={playerItemsJson}
                    onChange={(event) => setPlayerItemsJson(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            parsePlayerItems();
                        }
                    }}
                    placeholder="Copy and paste items from url above"
                    spellCheck={false}
                />

                {playerItemsJson ? (
                    <button className="btn ml-1.5" onClick={() => parsePlayerItems()} type="button">
                        Parse
                    </button>
                ) : null}
            </div>
        </div>
    );
}
