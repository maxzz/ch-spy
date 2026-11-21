# coursehunters-course-list-browser

Browse the lessons of a course on [coursehunter.net](https://coursehunter.net), download the videos, and export a Windows `rename.cmd` file that renames them with the lesson numbers.

The app is a React + Vite + Tailwind CSS + Jotai project. It was migrated from an earlier Vue app; the behavior and the saved-session format are the same.

## Usage

Paste the course page URL (the app fetches it) or the page HTML into the input, then press **Fetch** / **Parse**.

- If the page has no lesson list, the app shows a player items URL. Open it, copy the JSON, and paste it into the second input (**Parse**).
- **Get** downloads one video with a progress meter.
- **Download rename.cmd** saves `rename.cmd.txt` (the batch rename) and `page-source.txt` (the saved session). Drop `page-source.txt` onto the page to restore it.
- **Clear** clears the fetched course. **Ctrl+Click** on Clear also clears the player items.

## Scripts

```bash
pnpm dev      # dev server on port 3000
pnpm build    # type-check and build to dist/
pnpm preview  # serve the build
pnpm test     # unit tests (parsing, rename files, session restore)
pnpm check:tw # check Tailwind class order (see .cursor/rules/tailwind-class-order.mdc)
```

## Code layout

All of the course browser lives in `src/course-hunter/`:

- `core/`: pure logic without React or Jotai. HTML and player-items parsing (`engine.ts`), rename-file generation (`rename.ts`), and session patches (`session.ts`). Unit tests and two saved course pages are in `core/`.
- `store/`: Jotai atoms. `source.ts` (persisted inputs), `state.ts` (session state), `derived.ts` (computed values), `actions.ts` (write-only actions), `downloads.ts` (per-video download state).
- `components/`: React components. They read and write atoms directly and do not use `useState`, `useEffect`, or `useCallback`.
- `lib/`: browser helpers (file download with progress, localStorage adapter, cookies).
- `dev-tools/`: the cookie setter and localStorage test from the previous app. They are shown only in the dev server (`import.meta.env.DEV`) and are not in the production build.

`src/app.tsx` only renders `CourseHunterApp`. The shadcn/ui components are in `src/ui/shadcn/` (configured by `components.json`, theme in `src/index.css`); the course page does not use them yet.

## Saved data

The session is stored in `localStorage` under the same keys as the previous app: `ch-spy-html` (the pasted URL or HTML) and `ch-spy-playeritems` (the player items JSON).
