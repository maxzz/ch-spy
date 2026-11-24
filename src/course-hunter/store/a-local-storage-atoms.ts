import { useCallback } from "react";
import { useAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { plainLocalStorage } from "../../utils/lib/local-storage";

// Same keys as the previous Vue app, so a saved session carries over.
export const STORAGE_KEY_HTML = 'ch-spy-26-html';
export const STORAGE_KEY_PLAYER_ITEMS = 'ch-spy-26-playeritems';
export const STORAGE_KEY_ACCORDIONS = 'ch-spy-26-accordions';

/** Course page URL or HTML pasted by the user. Persisted. */
export const sourceInputAtom = atomWithStorage(STORAGE_KEY_HTML, '', plainLocalStorage, { getOnInit: true });

/** Player items JSON pasted from the player items URL. Persisted. */
export const playerItemsJsonAtom = atomWithStorage(STORAGE_KEY_PLAYER_ITEMS, '', plainLocalStorage, { getOnInit: true });

/** Open accordion item values, per accordion group (group name -> open item values). Persisted under its own key. */
export const accordionsOpenAtom = atomWithStorage<Record<string, string[]>>(
    STORAGE_KEY_ACCORDIONS,
    {},
    createJSONStorage(() => plainLocalStorage),
    { getOnInit: true },
);

const noOpenItems: string[] = [];

/** Controlled `value` / `onValueChange` props for a Radix accordion, persisted under `group`. */
export function useAccordionOpenState(group: string) {
    const [state, setState] = useAtom(accordionsOpenAtom);

    const onValueChange = useCallback(
        (value: string[]) => setState((prev) => ({ ...prev, [group]: value })),
        [group, setState],
    );

    return { value: state[group] ?? noOpenItems, onValueChange };
}
