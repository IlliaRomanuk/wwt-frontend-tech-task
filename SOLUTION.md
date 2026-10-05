# Solution notes

## What was built

- Filter modal rendered dynamically from `filterData.json` (groups, options and descriptions come from the data, not hard-coded).
- Draft state lives inside the modal; the saved filter lives in a zustand store. The modal is mounted only while open, so every opening starts from the saved filter (pre-fill) and closing discards the draft.
- `Apply` opens a confirmation dialog: "Apply new filter" saves to the store, "Use old filter" keeps the previous data. The X / Esc / backdrop of the confirmation only return to editing.
- The current saved filter is shown on the home page as JSON (`SearchRequestFilter`).

## Decisions

- Native `<dialog>` + `showModal()` for the modals: focus trap, Esc and inert background without extra libraries. Page scroll is locked while a modal is open; focus returns to the opener.
- Semantic markup: `<form>`, `<fieldset>/<legend>`, `<label>`, `<header>/<footer>`, `<main>`.
- Data is loaded through react-query (`useFilterItems`) from a mocked API function reading `filterData.json`.
- All UI strings go through i18next (`filter` namespace); option/group names come from the API data.
- Design: the Figma layout was applied with consistent paddings between groups. The groups in the layout differ from `filterData.json`, so the data is the source of truth.

## Dependencies

No new dependencies were added.

## Tests / CI

- `selection.test.ts` covers the pure selection logic; `App.test.tsx` covers the whole flow (open, pre-fill, apply + confirm, use old, close, clear all, Esc, backdrop, scroll lock, focus).
- GitHub Action (`.github/workflows/pipeline.yml`): format check, lint, tests, build on Node 18 and 20.
