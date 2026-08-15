# Tech stack — locked decisions

Source of truth: `docs/architecture/tech-stack.md` and `docs/architecture/architecture.md`. Do not
re-derive these from scratch or re-ask the user — they are settled.

## Runtime & package manager

- **Bun only.** Bun is both the package manager and the runtime (`apps/api`
  Bun entrypoint, test runner). Never suggest pnpm/npm/yarn or Node as the
  primary runtime — the docs originally specified pnpm catalogs, but the user
  overrode that in favor of Bun for everything.
- Bun workspaces + **named `catalogs`** (root `package.json` under
  `workspaces.catalogs`), plus a default `workspaces.catalog` for
  cross-cutting tooling (typescript, turbo, oxlint/oxfmt, vitest,
  @playwright/test, bun-types, @types/node, globals, zod). Named groups:
  `react`, `ui`, `data`, `ai`, `server`, `db`, `queue`, `content`,
  `monitoring` — see root `package.json` for the current membership of each.
  Every dependency version is declared exactly once, in whichever catalog it
  belongs to; workspace packages reference it as `"<pkg>": "catalog:"` for
  the default catalog or `"<pkg>": "catalog:<group>"` for a named one. Never
  hardcode a version in a workspace package.json — add/update it in the
  relevant catalog instead. When adding a new dependency, put it in the
  named catalog matching its domain (or the default catalog only if it's
  genuinely cross-cutting tooling), not a new one-off group.
- When `bun add` is used inside a specific workspace, double-check it landed
  in that workspace's package.json (not root) and that the version matches
  (or gets added to) the correct catalog/named catalog — `bun add` does not
  do this automatically and has previously added stray un-cataloged entries
  to root
  by mistake.

## No Next.js

- This platform explicitly does **not** use Next.js anywhere. The dashboard
  is a Vite 8 + React 19 SPA (`@tanstack/react-router`), not SSR — reasoning
  is in `docs/architecture/architecture.md` §4. Never suggest Next.js, `next.config.*`,
  or App Router patterns. `packages/config/nextjs.json` was deleted for this
  reason — don't recreate it.

## Monorepo layout (must match docs/architecture/architecture.md §3)

```
apps/dashboard        Vite 8 + React 19 + TanStack Router/Query, Tailwind v4
apps/api              Hono — workers.ts (CF) / bun.ts (VPS) entrypoints
apps/edge-router      CF Worker: landing serving (KV+R2+Cache), event beacon
apps/landing-runtime  Vanilla TS, built as IIFE via tsdown (the one compiled package)
packages/studio-core  srcmap engine, patch ops, undo/redo (from dv-studio-kit @dv/core)
packages/studio-ui    Canvas/LayerTree/Inspector (from @dv/studio)
packages/studio-ai    patch protocol, prompt compiler (from @dv/ai)
packages/db           drizzle schema + org-scoped repositories
packages/auth         better-auth config + organization plugin + RBAC
packages/contracts    zod schemas / API types shared FE+BE
packages/drivers      jobs/storage/cache/realtime/payments interfaces + impls
packages/ai-gateway   provider abstraction (anthropic/openai/openrouter), key vault
packages/ui           design system L1 (shadcn wrap, tokens) — @dv/ui
packages/config       tsconfig presets + oxlint/oxfmt/tailwind config — @dv/config
tooling/              deploy/seed/lighthouse-ci scripts
```

Package names are `@dv/<name>` (not `@workspace/<name>` — that was a leftover
shadcn-scaffold alias, already fixed repo-wide).

## JIT internal packages — no build step for most packages

Per docs/architecture/architecture.md: internal packages are consumed as TS source
directly (Turborepo JIT strategy), **not** compiled to `dist/`. That's why
`packages/config/node-library.json` and `react-library.json` both set
`noEmit: true` — don't add `outDir`/build scripts to these packages.

**The one exception is `apps/landing-runtime`**, which IS compiled (via
`tsdown`) because its output is injected into published HTML — it needs a
real IIFE bundle, not TS source.

## Linting & formatting: Oxlint + Oxfmt (not ESLint/Prettier/Biome)

- `.oxlintrc.json` (root) — `oxlint --type-aware .`. Requires the
  `oxlint-tsgolint` package installed (peer requirement for `--type-aware`,
  not bundled with `oxlint` itself).
- React support needs the `react` plugin explicitly enabled (off by default)
  plus `react/react-in-jsx-scope` turned **off** — React 19's automatic JSX
  runtime means that rule is a false positive here.
- `oxlint-plugin-react-doctor` is wired in via `jsPlugins` (see
  `www.react.doctor` docs) for extra React-specific correctness rules
  (`no-fetch-in-effect`, `no-derived-state`).
- `.oxfmtrc.json` (root) — `oxfmt --write .` / `--check .`. Replaces
  Prettier entirely; `.prettierrc`/`.prettierignore` were deleted. Excludes
  `docs/` and `README.md` from reformatting (prose, not code).
- Both configs run **once at the repo root**, not per-package — there are no
  per-package `lint`/`format` scripts. Don't add them back.
- VS Code default formatter is `oxc.oxc-vscode` for all languages (was
  `esbenp.prettier-vscode` — already fixed in `.vscode/settings.json` and
  `.vscode/extensions.json`).
- **`bun run lint` must be run and fully clean after every implementation
  task, before reporting it done.** Fix real issues in the code. Only reach
  for `.oxlintrc.json` (rule `off`, or narrower `overrides`) when a rule is
  genuinely wrong for this project after analysis — e.g. structurally
  conflicts with a locked decision — not just because it's inconvenient.
  Prefer fixing the code or a scoped inline disable-with-reason first;
  disabling a rule repo-wide is for cases where the rule would misfire on
  every idiomatic use of a locked pattern.
- Rules already turned off repo-wide, and why: `react/jsx-no-constructed-context-values`
  and `react-perf/jsx-no-new-object-as-prop` are permanently in conflict with
  React Compiler (below) — both exist to push developers toward manual
  `useMemo`/`useCallback` for object literals passed as context value/props,
  which is exactly what `react-doctor/react-compiler-no-manual-memoization`
  tells you to remove since the compiler handles it. With React Compiler
  wired in, they'd fire on every idiomatic component. If a _function_
  (not object) shows up as a fresh dependency in a `useEffect`/`useMemo` array
  (`react-hooks/exhaustive-deps`, `react-doctor/no-effect-with-fresh-deps`),
  prefer inlining the function inside the effect/memo callback over disabling
  the rule — that resolves the conflict without losing the check.

## React Compiler wiring (real API, not the doc's simplified example)

`docs/architecture/tech-stack.md`'s `vite.config.ts` snippet shows
`react({ babel: reactCompilerPreset() })`, but the actual installed
`@vitejs/plugin-react@6.0.5` API does **not** accept a `babel` option. The
real, verified-working setup (see `apps/dashboard/vite.config.ts`) is:

```ts
import babel from "@rolldown/plugin-babel"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"

plugins: [react(), babel({ presets: [reactCompilerPreset()] })]
```

This needs `@rolldown/plugin-babel`, `@babel/core`, `babel-plugin-react-compiler`,
and `@types/babel__core` as devDependencies (all in the root catalog).

## Verifying changes to this scaffold

After touching `package.json`/tsconfig/oxlint/oxfmt config anywhere in the
repo, run all of: `bun install`, `bun run lint`, `bun run fmt:check`,
`bun run typecheck`, `bun run build`. All were green as of this setup —
don't let a "quick tweak" silently break one of them.
