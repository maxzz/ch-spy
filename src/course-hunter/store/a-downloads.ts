import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import path from 'path-browserify';

import { downloadWithProgress } from '../../utils/lib/download';

export interface DownloadState {
    tried: boolean;         // the Get button was pressed at least once
    busy: boolean;          // download in progress
    progress: number;       // percent
    succeeded: boolean;
    failed: boolean;
}

const initialDownloadState: DownloadState = {
    tried: false,
    busy: false,
    progress: 0,
    succeeded: false,
    failed: false,
};

//---------------------------------------------------------------------------

/** Download state of each video, keyed by its URL. */
export const downloadStateFamily = atomFamily(
    (_url: string) => atom<DownloadState>(initialDownloadState)
);

/** Downloads a video with progress. Results are stored in downloadStateFamily(url). */
export const startDownloadAtom = atom(
    null,
    (_get, set, url: string) => {
        const state = downloadStateFamily(url);
        set(state, { ...initialDownloadState, tried: true, busy: true });

        downloadWithProgress({
            url,
            filename: path.basename(url),
            onProgress: (percent) => set(state, (prev) => ({ ...prev, progress: percent })),
        })
            .then(() => {
                set(state, (prev) => ({ ...prev, busy: false, progress: 0, succeeded: true, failed: false }));
                console.log('done', url);
            })
            .catch((error) => {
                set(state, (prev) => ({ ...prev, busy: false, succeeded: false, failed: true }));
                console.log('err', url, error);
            });
    }
);
