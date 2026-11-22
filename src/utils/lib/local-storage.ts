/**
 * Plain string values in localStorage, the same format the previous Vue app used,
 * so saved sessions keep working. Changes made in other tabs are picked up.
 *
 * Matches Jotai's synchronous SyncStorage<string> shape (used by atomWithStorage).
 */
export const plainLocalStorage = {
    getItem: (key: string, initialValue: string): string => localStorage.getItem(key) ?? initialValue,

    setItem: (key: string, value: string): void => localStorage.setItem(key, value),

    removeItem: (key: string): void => localStorage.removeItem(key),

    subscribe: (key: string, callback: (value: string) => void, initialValue: string): (() => void) => {
        const onStorage = (event: StorageEvent) => {
            if (event.storageArea === localStorage && event.key === key) {
                callback(event.newValue ?? initialValue);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    },
};
