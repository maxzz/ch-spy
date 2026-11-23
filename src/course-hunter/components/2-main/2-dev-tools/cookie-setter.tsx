import { useAtom, useSetAtom } from 'jotai';
import { cookieInputAtom, clearCookiesAtom, setCookiesAtom } from './store';
import { Button } from '@/ui/shadcn/button';

export function CookieSetter() {
    const [cookieInput, setCookieInput] = useAtom(cookieInputAtom);
    const setCookies = useSetAtom(setCookiesAtom);
    const clearCookies = useSetAtom(clearCookiesAtom);

    return (
        <div className="m-4 grid grid-cols-[1fr_auto_auto] gap-x-[.2em]">
            <input
                className="leading-[1.2em] text-xs"
                value={cookieInput}
                onChange={(event) => setCookieInput(event.target.value)}
                placeholder="Type cookie"
            />
            <Button variant="outline" onClick={() => clearCookies()} type="button">Clear Document Cookie</Button>
            <Button variant="outline" onClick={() => setCookies()} type="button">Set Cookie</Button>
        </div>
    );
}
