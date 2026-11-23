import { useAtomValue, useSetAtom } from 'jotai';
import { errorMsgAtom, setErrorAtom } from '../../store/a-local-storage-state';
import { Button } from '@/ui/shadcn/button';

export function ErrorMessage() {
    const errorMsg = useAtomValue(errorMsgAtom);
    const setError = useSetAtom(setErrorAtom);

    if (!errorMsg) {
        return null;
    }

    return (
        <div className="mt-4 p-2.5 bg-[red] flex items-center">
            <span className="grow text-[.8rem] text-white">Error: {errorMsg}</span>
            <Button variant="ghost" className="ml-4 w-[1.6rem] outline-none flex justify-center" onClick={() => setError('')} tabIndex={-1} type="button">
                &times;
            </Button>
        </div>
    );
}
