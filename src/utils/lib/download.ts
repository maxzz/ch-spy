import JsFileDownloader from "js-file-downloader";

export const DOWNLOAD_TIMEOUT_MS = 2 * 60 * 1000;

/**
 * Downloads a remote file and reports progress in percent.
 * If the server does not send a length, progress is reported as 50.
 */
export async function downloadWithProgress({ url, filename, onProgress }: {
    url: string;
    filename: string;
    onProgress: (percent: number) => void;
}): Promise<void> {
    await new JsFileDownloader({
        url,
        filename,
        timeout: DOWNLOAD_TIMEOUT_MS,
        process: (event: ProgressEvent) => {
            onProgress(event.lengthComputable ? Math.floor((event.loaded / event.total) * 100) : 50);
            return undefined;
        },
    });
}

/** Saves a generated text as a file. Errors are logged, not thrown. */
export async function downloadBlob(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    try {
        await new JsFileDownloader({ url, filename });
    } catch (error) {
        console.error('Cannot save file', filename, error);
    } finally {
        URL.revokeObjectURL(url);
    }
}
