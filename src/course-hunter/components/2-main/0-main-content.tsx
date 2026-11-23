import { useAtomValue } from 'jotai';
import { cx } from '../../../utils/lib/classnames';
import { ScrollArea } from '../../../ui/shadcn/scroll-area';
import { Accordion } from '../../../ui/shadcn/accordion';

import { courseInfoAtom, itemsAtom, playerItemsUrlAtom } from '../../store/a-local-storage-state';

import { ErrorMessage } from './4-error-message';
import { Row1_SourceInput } from './1-row1-source-input';
import { Row2_PlayerItemsActions } from './2-row2-player-items-actions';
import { Part_AllTogether, Part_BatchRename, DownloadRenameButton, EditableLockToggle } from './3-2-part2-other';
import { Part_GeneratedItems } from './3-1-part1-playable-items';
import { DevPanels } from './2-dev-tools/dev-panels';

export function MainContent() {
    const playerItemsUrl = useAtomValue(playerItemsUrlAtom);
    const items = useAtomValue(itemsAtom);

    return (
        <div className="flex-1 min-h-0 w-full mx-auto max-w-3xl bg-gray-300">
            <ScrollArea fullHeight fixedWidth className="h-full">
                <div className="px-2 py-4">
                    <Row1_SourceInput />

                    <Row2_PlayerItemsActions />

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

function GeneratedList() {
    const { title, desc } = useAtomValue(courseInfoAtom);

    const items = useAtomValue(itemsAtom);
    if (!items.length) {
        return null;
    }

    return (
        <div className="relative">
            <div className="relative pb-2 min-h-16 font-bold text-[#5d0083] bg-linear-to-r from-[#88b0ff] to-[#bc94fe82] flex items-end justify-center">
                <div title={desc}>{title}</div>

                <EditableLockToggle className="absolute bottom-1 right-1 w-5 h-5 text-purple-500 stroke-1" />
            </div>

            <div className="absolute top-1 right-0 flex justify-end">
                <DownloadRenameButton />
            </div>

            <Part_GeneratedItems />

            <Accordion type="multiple">
                <Part_BatchRename />
                <Part_AllTogether />
            </Accordion>
        </div>
    );
}
