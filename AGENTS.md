# Repository Guidelines

## Project Structure & Module Organization
The Vue 3 + TypeScript app keeps feature code in `src/`. Shared UI pieces belong in `src/components`, page-level views in `src/views`, and reusable logic in `src/composables`. Global routing stays in `src/router`, state in `src/store`, and static assets in `src/assets`. Public-facing files go under `public/`. Unit and integration tests sit in `tests/unit`, while end-to-end specs live in `tests/e2e`. When adding a feature, prefer a `src/modules/<feature>` folder that groups components, composables, and tests together.

## Build, Test, and Development Commands
Use `npm install` once per environment. `npm run dev` launches Vite with hot module reload. `npm run build` outputs production assets in `dist/`. Run `npm run preview` to verify the production build locally. Execute `npm run test:unit` for Vitest suites and `npm run test:e2e` before merging UI changes. `npm run lint` and `npm run format` keep the codebase aligned with project standards.

## Coding Style & Naming Conventions
Follow TypeScript strict mode and 2-space indentation. Components use PascalCase filenames (e.g., `BookingCard.vue`); composables use `useX` camelCase (e.g., `useAppointmentLookup.ts`). Style blocks default to SCSS modules with BEM-style class names. ESLint with the Vue, TypeScript, and Prettier configs enforces spacing, imports, and template rules—run `npm run lint -- --fix` before pushing.

## Testing Guidelines
Write Vitest specs alongside source files or in `tests/unit` using the `Component.spec.ts` pattern. Mock HTTP calls with `msw` fixtures, and reset the Pinia store between tests. E2E coverage relies on Cypress specs in `tests/e2e` named `*.cy.ts`; include a smoke path for each customer journey. Target >=80% statement coverage and document any intentional gaps in the PR.

## Commit & Pull Request Guidelines
Adopt Conventional Commits (`feat:`, `fix:`, `chore:`) with concise summaries. Group related file changes per commit to simplify rollbacks. Pull requests should describe the change, link issues, and include before/after screenshots for UI or console output for CLI updates. Request review once tests, linting, and accessibility checks pass, and note any follow-up tasks in the PR description.
