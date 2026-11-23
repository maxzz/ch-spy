import { useAtom } from 'jotai';
import { storageTextAtom } from './store';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';

export function StorageText() {
    const [stored, setStored] = useAtom(storageTextAtom);

    return (
        <div className="m-4 text-xs flex flex-col items-start gap-2">
            <Button variant="outline" onClick={() => setStored((prev) => ({ ...prev, counter: prev.counter + 1 }))} type="button">
                count is: {stored.counter}
            </Button>
            <Button variant="outline" onClick={() => setStored((prev) => ({ ...prev, counter: 0 }))} type="button">
                reset count
            </Button>

            <Input
                className="text-gray-100 bg-purple-600"
                value={stored.text}
                onChange={(event) => setStored((prev) => ({ ...prev, text: event.target.value }))}
            />

            <Button variant="outline" onClick={() => setStored((prev) => ({ ...prev, text: `${prev.text}-` }))} type="button">
                Text: {stored.text}
            </Button>
            <Button variant="outline" onClick={() => setStored((prev) => ({ ...prev, text: '' }))} type="button">
                reset text
            </Button>
        </div>
    );
}
