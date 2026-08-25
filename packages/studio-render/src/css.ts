import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/postcss";
import postcss from "postcss";

/**
 * Utility CSS is a function of the ~25-component catalog source, not of any single page's
 * content — every page ships the same Tailwind build, so compile once per process and cache.
 * Page-specific colors/fonts come from `DesignTokens` (`tokens.ts`), inlined separately.
 */
const catalogSourceGlob = fileURLToPath(
  new URL("../../studio-catalog/src/**/*.tsx", import.meta.url)
);

/**
 * A real path inside this package's own directory, not `packages/studio-catalog`'s — only
 * used so `@tailwindcss/postcss` resolves `@import "tailwindcss"` from *this* package's
 * node_modules (where `tailwindcss` is an actual dependency) regardless of which app calls
 * `compileCatalogCss()`. Bun's isolated linker doesn't hoist deps to a shared root, so
 * resolving from the caller's cwd (e.g. `apps/api`, which has no direct `tailwindcss` dep)
 * fails otherwise.
 */
const virtualInputPath = fileURLToPath(
  new URL("../input.css", import.meta.url)
);

let cached: Promise<string> | null = null;

export function compileCatalogCss(): Promise<string> {
  cached ??= compile();
  return cached;
}

/** Test-only: forces the next `compileCatalogCss()` call to recompile. */
export function resetCatalogCssCache(): void {
  cached = null;
}

async function compile(): Promise<string> {
  const input = `@import "tailwindcss";\n@source "${catalogSourceGlob}";\n`;
  const result = await postcss([tailwindcss()]).process(input, {
    from: virtualInputPath
  });
  return result.css;
}
