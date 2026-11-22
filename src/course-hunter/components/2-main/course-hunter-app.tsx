import '../styles.css';
import { useAtomValue, useSetAtom } from 'jotai';
import { DevPanels } from '../../dev-tools/dev-panels';
import { dropFileAtom } from '../../store/actions';
import { dragActiveAtom, itemsAtom, playerItemsUrlAtom } from '../../store/state';
import { cx } from '../../lib/classnames';
import { ErrorMessage } from '../error-message';
import { GeneratedList } from '../generated-list';
import { Header } from '../header';
import { PlayerItemsRow } from '../player-items-row';
import { SourceRow } from '../source-row';

/** Course list browser: paste or drop a course page, then download the videos. */
export function CourseHunterApp() {
    const setDragActive = useSetAtom(dragActiveAtom);
    const dropFile = useSetAtom(dropFileAtom);
    const playerItemsUrl = useAtomValue(playerItemsUrlAtom);
    const items = useAtomValue(itemsAtom);

    return (
        <div
            className="min-h-screen bg-[#201c2b]"
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(event) => {
                event.stopPropagation();
                event.preventDefault();
            }}
            onDrop={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setDragActive(false);

                const file = event.dataTransfer?.files[0];
                if (file) {
                    void dropFile(file);
                }
            }}
        >
            <Header />

            <div className="px-2 py-4 mx-auto max-w-3xl bg-gray-300">
                <SourceRow />

                <PlayerItemsRow />

                <div className={cx(playerItemsUrl && items.length > 0 && '-mt-8')}>
                    <GeneratedList />
                </div>

                <ErrorMessage />

                <DevPanels />
            </div>
        </div>
    );
}
