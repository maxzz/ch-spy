import { useAtom } from 'jotai';
import { storageTextAtom } from './store';

export function StorageText() {
    const [stored, setStored] = useAtom(storageTextAtom);

    return (
        <div className="m-4 text-xs flex flex-col items-start gap-2">
            <button className="btn" onClick={() => setStored((prev) => ({ ...prev, counter: prev.counter + 1 }))} type="button">
                count is: {stored.counter}
            </button>
            <button className="btn" onClick={() => setStored((prev) => ({ ...prev, counter: 0 }))} type="button">
                reset count
            </button>

            <input
                className="px-2 py-1 text-gray-100 bg-purple-600"
                value={stored.text}
                onChange={(event) => setStored((prev) => ({ ...prev, text: event.target.value }))}
            />

            <button className="btn" onClick={() => setStored((prev) => ({ ...prev, text: `${prev.text}-` }))} type="button">
                Text: {stored.text}
            </button>
            <button className="btn" onClick={() => setStored((prev) => ({ ...prev, text: '' }))} type="button">
                reset text
            </button>
        </div>
    );
}
