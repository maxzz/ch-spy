import jsDownloader from 'js-file-downloader';

export function pad2(n: number): string {
    if (n < 10) {
        return `0${n}`;
    }
    return `${n}`;
}

export async function downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    try {
        await new jsDownloader({ url, filename });
    } catch (error) {
        //console.log('error', error);
        return { error };
    } finally {
        //console.log('clean');
        URL.revokeObjectURL(url);
    }
    //console.log('done');
    return { success: true };
}

export function textFileReader(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const aborted = () => reject(`File (${file.name}) reading was aborted`);
        reader.onabort = aborted;
        reader.onerror = aborted;
        reader.onload = () => resolve(reader.result?.toString() || '');
        reader.readAsText(file);
    });
}
