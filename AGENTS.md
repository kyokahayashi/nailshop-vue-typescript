# Repository Guidelines

## Project Structure & Module Organization
The Vue 3 + TypeScript app keeps feature logic in `src/modules/`. Shared UI pieces live in `src/components`, page views in `src/views`, and static assets in `public/`. Routing is managed in `src/router`, while Pinia stores sit alongside their features (e.g., `modules/nails`, `modules/cart`, `modules/orders`). Global styles are centralized in `src/styles`. Tests follow the same layout beneath `tests/unit` and `tests/e2e`.

## Build, Test, and Development Commands
Use `npm install` once per environment. `npm run dev` launches Vite with hot module reload. `npm run build` outputs production assets in `dist/`. Run `npm run preview` to verify the production build locally. Execute `npm run test:unit` for Vitest suites and `npm run test:e2e` before merging UI changes. `npm run lint` and `npm run format` keep the codebase aligned with project standards.

## Coding Style & Naming Conventions
Follow TypeScript strict mode and 2-space indentation. Components use PascalCase filenames (e.g., `ProductCard.vue`); stores/composables use `useX` camelCase (e.g., `useNailStore.ts`). Styles rely on SCSS utility classes or scoped blocks per view. ESLint (Vue + TypeScript) and Prettier enforce formatting—run `npm run lint -- --fix` before pushing.

## Testing Guidelines
Write Vitest specs alongside source files or in `tests/unit` using the `Component.spec.ts` pattern. Mock HTTP calls with `msw` fixtures, and reset the Pinia store between tests. E2E coverage relies on Cypress specs in `tests/e2e` named `*.cy.ts`; include a smoke path for each customer journey. Target >=80% statement coverage and document any intentional gaps in the PR.

## Commit & Pull Request Guidelines
Adopt Conventional Commits (`feat:`, `fix:`, `chore:`) with concise summaries. Group related file changes per commit to simplify rollbacks. Pull requests should describe the change, link issues, and include before/after screenshots for UI or console output for CLI updates. Request review once tests, linting, and accessibility checks pass, and note any follow-up tasks in the PR description.
