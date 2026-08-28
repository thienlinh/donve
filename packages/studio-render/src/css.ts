import { CATALOG_CSS } from "./catalog.generated.js";

/**
 * Utility CSS is a function of the ~25-component catalog source, not of any single page's
 * content — every page ships the same Tailwind build. It's precompiled by
 * scripts/generate-catalog-css.ts and checked in as catalog.generated.ts rather than compiled
 * here at runtime: `@tailwindcss/postcss`'s native oxide binary can't run inside the CF Workers
 * isolate apps/api's workers.ts entrypoint runs in.
 */
export function compileCatalogCss(): Promise<string> {
  return Promise.resolve(CATALOG_CSS);
}
