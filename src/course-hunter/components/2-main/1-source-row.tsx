import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { cx } from '../../../utils/lib/classnames';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import { CLEAR_BUTTON_ID, clearSourceAtom, parseOrFetchAtom } from '../../store/a-actions';
import { fetchButtonNameAtom } from '../../store/a-derived';
import { sourceInputAtom } from '../../store/a-local-storage-atoms';
import { itemsAtom, playerItemsUrlAtom } from '../../store/a-local-storage-state';

/** Row 1: Clear button, and the URL/HTML input with its Fetch or Parse button. */
export function SourceRow() {
    const [sourceInput, setSourceInput] = useAtom(sourceInputAtom);
    const items = useAtomValue(itemsAtom);
    const playerItemsUrl = useAtomValue(playerItemsUrlAtom);
    const fetchButtonName = useAtomValue(fetchButtonNameAtom);
    
    const clearSource = useSetAtom(clearSourceAtom);
    const parseOrFetch = useSetAtom(parseOrFetchAtom);

    return (
        <div className={cx('flex', !playerItemsUrl && items.length > 0 && 'mb-1')}>
            <Button
                id={CLEAR_BUTTON_ID}
                variant="outline"
                className={cx('mr-2 transition-transform', !sourceInput && !items.length && 'scale-x-0')}
                onClick={(event) => clearSource(event.ctrlKey)}
                title="Clear fetched data. Ctrl+Click clear player items as well"
                type="button"
            >
                Clear
            </Button>

            <div className="focus-within:ring-2 ring-offset-2 ring-purple-600 ring-offset-gray-200 rounded overflow-hidden flex flex-1">
                <Input
                    className={cx('flex-1 text-xs outline-none border-gray-600', sourceInput ? 'border-r-0' : 'border')}
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
                    variant="outline"
                    className={cx(
                        'rounded-l-none transition-transform active:rounded-sm active:border focus:ring-0 focus:shadow-none',
                        sourceInput ? '-ml-4' : 'px-0 w-0 border-none -translate-x-6',
                    )}
                    onClick={() => parseOrFetch()}
                    tabIndex={-1}
                    type="button"
                >
                    {fetchButtonName}
                </Button>
            </div>
        </div>
    );
}
