import { CookieSetter } from './cookie-setter';
import { StorageText } from './storage-text';

/** Developer panels (cookies, localStorage test). Rendered in the dev server only. */
export function DevPanels() {
    if (!import.meta.env.DEV) {
        return null;
    }

    return (
        <section className="mt-4 p-2.5 bg-gray-100 border border-dashed border-gray-600">
            <h2 className="text-sm font-bold">Dev tools</h2>
            <CookieSetter />
            <StorageText />
        </section>
    );
}
