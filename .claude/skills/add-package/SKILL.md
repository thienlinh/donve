---
name: add-package
description: Scaffold a new package under packages/ or app under apps/ in this monorepo, following the established conventions (tsconfig preset, bun catalog deps, turbo.json). Use when the user asks to add/create a new package, app, or module in this repo.
---

# Add a package or app (donve monorepo)

Read `.claude/rules/tech-stack.md` first if not already in context — it has
the full rationale. This skill is just the mechanical steps.

## Steps

1. **Pick the tsconfig preset** from `packages/config/`:
   - `react-library.json` — a package exporting React components (like `@dv/ui`, `@dv/studio-ui`)
   - `node-library.json` — a Bun/Node backend package or app (`@dv/db`, `@dv/auth`, `apps/api`, ...)
   - `vite-app.json` — a Vite-built frontend app (`apps/dashboard`)
   - `base.json` — anything else (e.g. `apps/landing-runtime`, vanilla TS)

2. **Create `<dir>/package.json`**:
   - Name: `@dv/<name>` for packages, plain `<name>` for apps (matches existing convention).
   - `"private": true`, `"type": "module"`.
   - Any real dependency version goes through `"catalog:"` — if it's not yet
     in the root `workspaces.catalog`, add it there first (check the real
     published version via `npm view <pkg> versions`, don't guess).
   - `devDependencies` always includes `"@dv/config": "workspace:*"` and
     `"typescript": "catalog:"`.
   - Only add a `"build"` script if this package is meant to be compiled
     (rare — see the JIT-packages note in the tech-stack rule). Otherwise
     just `"typecheck": "tsc --noEmit"`.

3. **Create `<dir>/tsconfig.json`** extending the chosen preset:

   ```json
   {
     "extends": "@dv/config/<preset>.json",
     "include": ["src"],
     "exclude": ["node_modules", "dist"]
   }
   ```

   Don't add `outDir` unless this package actually builds (see step 2).

4. **Create `<dir>/turbo.json`**:

   ```json
   { "$schema": "https://turbo.build/schema.json", "extends": ["//"] }
   ```

5. **Create `<dir>/src/index.ts`** with real, non-empty content — oxlint's
   `unicorn/no-empty-file` rejects a file that's just a comment. A minimal
   placeholder export is fine while the module is unimplemented.

6. **Verify**: `bun install && bun run lint && bun run typecheck && bun run build`.
   All four must stay green.
