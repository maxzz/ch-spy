import { atomWithStorage } from 'jotai/utils';
import { plainLocalStorage } from '../../utils/lib/local-storage';

// Same keys as the previous Vue app, so a saved session carries over.
export const STORAGE_KEY_HTML = 'ch-spy-26-html';
export const STORAGE_KEY_PLAYER_ITEMS = 'ch-spy-26-playeritems';

/** Course page URL or HTML pasted by the user. Persisted. */
export const sourceInputAtom = atomWithStorage(STORAGE_KEY_HTML, '', plainLocalStorage, { getOnInit: true });

/** Player items JSON pasted from the player items URL. Persisted. */
export const playerItemsJsonAtom = atomWithStorage(STORAGE_KEY_PLAYER_ITEMS, '', plainLocalStorage, { getOnInit: true });
