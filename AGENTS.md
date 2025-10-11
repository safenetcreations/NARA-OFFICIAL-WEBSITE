# Repository Guidelines

## Project Structure & Module Organization
The Vite workspace lives in `nara_digital_ocean/`. `src/` holds runtime code: page-level routes in `src/pages/`, shared UI in `src/components/` (atoms under `ui/`), contexts and stores in `src/contexts/` and `src/store/`, and API helpers in `src/services/` and `src/utils/`. Global themes, Tailwind extensions, and CSS variables sit in `src/styles/`. Static assets and HTML live in `public/`, and builds land in `build/`. Absolute imports from `src/` are enabled via `jsconfig.json`.

## Build, Test, and Development Commands
Install dependencies once with `npm install`. Run `npm run start` for the Vite dev server on port 4028, `npm run build` for the optimized bundle with sourcemaps, and `npm run serve` to preview the compiled build. Firebase workflows use the bundled CLI: `npx firebase emulators:start` spins up local auth/firestore/functions, and `npx firebase deploy` publishes hosting and rules updates.

## Coding Style & Naming Conventions
Match the existing two-space indentation and favor single quotes in JSX. Components, hooks, and stores follow PascalCase filenames (`ThemeNavbar.jsx`, `useThemeStore.js`); feature folders and routes stay kebab-case. Keep Tailwind classes close to the markup and share reusable tokens through `src/styles`. When exposing new helpers, add them to the nearest `index.js` barrel so import paths remain stable. Run your editor formatter (Prettier-compatible) before committing to avoid diff churn.

## Testing Guidelines
React Testing Library, user-event, and Jest DOM are available; prefer Vitest as the runner. Add a `test` script (e.g., `vitest --run`) before landing suites, and keep specs next to the code (`Component.test.jsx`) or grouped under `src/__tests__/`. Emulate Firebase services via the local emulator suite instead of live projects. Aim for smoke coverage on new pages and interaction coverage on complex forms, charts, and async state flows.

## Commit & Pull Request Guidelines
Follow Conventional Commit summaries (`feat(nav): add theme toggle memoization`). Keep commits scoped and avoid mixing refactors with features. PRs should link issues, call out affected routes/components, document local testing (`npm run build`, emulator checks), and include screenshots or recordings for UI shifts. Request review from the owning team, wait for automation to finish, and re-run the build after resolving merge conflicts.

## Configuration & Security Notes
`src/firebase.js` currently embeds staging credentials; move secrets into `.env` and read them through `import.meta.env` before production. When you need emulators, toggle the helpers at the bottom of that module instead of hardcoding URLs. Audit Tailwind plugins and Firebase rules during feature work to ensure access levels stay principle-of-least-privilege.
