import { useAtomValue } from 'jotai';
import { cx } from '../../../utils/lib/classnames';
import { ScrollArea } from '../../../ui/shadcn/scroll-area';

import { DevPanels } from './2-dev-tools/dev-panels';
import { itemsAtom, playerItemsUrlAtom } from '../../store/a-local-storage-state';
import { ErrorMessage } from './3-error-message';
import { GeneratedList } from './2-0-generated-list';
import { PlayerItemsRow } from './2-3-player-items-row';
import { SourceRow } from './1-source-row';

export function MainContent() {
    const playerItemsUrl = useAtomValue(playerItemsUrlAtom);
    const items = useAtomValue(itemsAtom);

    return (
        <div className="flex-1 min-h-0 w-full mx-auto max-w-3xl bg-gray-300">
            <ScrollArea fullHeight fixedWidth className="h-full">
                <div className="px-2 py-4">
                    <SourceRow />

                    <PlayerItemsRow />

                    <div className={cx(playerItemsUrl && items.length > 0 && '-mt-8')}>
                        <GeneratedList />
                    </div>

                    <ErrorMessage />

                    <DevPanels />
                </div>
            </ScrollArea>
        </div>
    );
}
