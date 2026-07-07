# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite React/TypeScript portfolio site. Application code lives in `src/`, with the entry point in `src/main.tsx` and top-level composition in `src/App.tsx`. Reusable UI sections are in `src/components/`, while Three.js/react-three-fiber visuals are grouped under `src/components/3d/`. Shared types are in `src/types.ts`, utilities are in `src/utils/`, and content/assets such as `cv_es.yaml` and SVGs live in `src/assets/`. Static public files belong in `public/`. Build and tooling configuration is kept at the repository root (`vite.config.ts`, `tailwind.config.js`, `eslint.config.js`, and TypeScript configs).

## Build, Test, and Development Commands

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm run dev`: start the local Vite development server with hot reload.
- `pnpm run build`: run TypeScript project checks, then create the production build in `dist/`.
- `pnpm run lint`: lint TypeScript and React files with ESLint.
- `pnpm run preview`: serve the production build locally for verification.

Run `pnpm run build` before deployment or major UI changes to catch strict TypeScript errors.

## Coding Style & Naming Conventions

Use TypeScript, React function components, and ES modules. Component files use PascalCase names such as `Hero.tsx` and `Projects.tsx`; utility files use camelCase names such as `loadCv.ts`. Keep component-specific styling close to the component when practical, and use Tailwind utility classes for layout and visual styling. Follow the existing two-space indentation in TSX/CSS where possible, and keep imports explicit. ESLint enforces recommended JavaScript, TypeScript, React Hooks, and React Refresh rules.

## Testing Guidelines

There is currently no dedicated test framework configured. For changes, rely on `pnpm run lint`, `pnpm run build`, and manual checks in `pnpm run dev` or `pnpm run preview`. If tests are added later, place them near the feature they cover using a clear pattern such as `ComponentName.test.tsx`, and document the new test command in `package.json` and this guide.

## Commit & Pull Request Guidelines

Recent history uses short, imperative commit messages, for example `Fix typescript errors for deployment` and `creación de portafolio`. Keep commits focused on one logical change and mention user-visible impact when relevant. Pull requests should include a concise description, testing performed (`pnpm run lint`, `pnpm run build`, browser checks), linked issues if applicable, and screenshots or recordings for visual changes.

## Security & Configuration Tips

Do not commit secrets, deployment tokens, or local environment files. Keep generated output such as `dist/` out of source control unless the deployment workflow explicitly requires it.
