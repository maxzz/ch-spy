import { useAtomValue, useSetAtom } from 'jotai';
import { downloadStateFamily, startDownloadAtom } from '../../store/downloads';
import { cx } from '../../../utils/lib/classnames';

export function DownloadButton({ url, selectable }: { url: string; selectable: boolean; }) {
    const { tried, busy, progress, succeeded, failed } = useAtomValue(downloadStateFamily(url));
    const startDownload = useSetAtom(startDownloadAtom);

    return (
        <div className="relative">
            <button
                className="btn py-0 h-6 text-sm"
                disabled={busy || !url}
                onClick={() => startDownload(url)}
                tabIndex={selectable ? undefined : -1}
                type="button"
            >
                Get
            </button>

            {progress !== 0 && <div className="ch-progress">{progress}</div>}

            {tried && (
                <div className="ch-meter">
                    <span className={cx(failed && 'ch-failed')} style={{ width: succeeded ? '100%' : `${progress}%` }} />
                </div>
            )}
        </div>
    );
}
