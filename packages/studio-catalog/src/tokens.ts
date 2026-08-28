import type { DesignTokens } from "@dv/contracts";
import type { Spec } from "@json-render/core";

export { designTokensSchema, type DesignTokens } from "@dv/contracts";

/** Neutral fallback tokens — used wherever a page/preview has no tenant-specific brand yet
 * (manual page creation, component-preview e2e fixtures). */
export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  colorPrimary: "#111827",
  colorPrimaryForeground: "#ffffff",
  colorAccent: "#4f46e5",
  colorAccentForeground: "#ffffff",
  colorSurface: "#ffffff",
  colorForeground: "#111827",
  colorMuted: "#6b7280",
  colorBorder: "#e5e7eb",
  fontHeading: "Inter, sans-serif",
  fontBody: "Inter, sans-serif",
  radius: "0.5rem"
};

/** CSS custom property name a component references via `var(--lp-<key>)` — never a literal color. */
export const lpVar = (
  key:
    | "color-primary"
    | "color-primary-foreground"
    | "color-accent"
    | "color-accent-foreground"
    | "color-surface"
    | "color-foreground"
    | "color-muted"
    | "color-border"
    | "font-heading"
    | "font-body"
    | "radius"
) => `var(--lp-${key})`;

/** Emits the `:root` style block from resolved tokens — called once per page at SSR time. */
export function designTokensToCss(tokens: DesignTokens): string {
  return `:root{--lp-color-primary:${tokens.colorPrimary};--lp-color-primary-foreground:${tokens.colorPrimaryForeground};--lp-color-accent:${tokens.colorAccent};--lp-color-accent-foreground:${tokens.colorAccentForeground};--lp-color-surface:${tokens.colorSurface};--lp-color-foreground:${tokens.colorForeground};--lp-color-muted:${tokens.colorMuted};--lp-color-border:${tokens.colorBorder};--lp-font-heading:${tokens.fontHeading};--lp-font-body:${tokens.fontBody};--lp-radius:${tokens.radius};}`;
}

/**
 * Curated Google Fonts offered in the Design Tokens editor — deliberately a fixed allowlist,
 * not free-text-to-URL: `fontHeading`/`fontBody` are otherwise free text (a tenant can type any
 * CSS font stack), and building a Google Fonts stylesheet URL straight from unsanitized text
 * would let arbitrary strings flow into a `<link href>` on the published page. Matching against
 * this list is also what decides whether a stylesheet gets injected at all — a custom/system
 * font stack (e.g. "Georgia, serif") is skipped, not silently pointed at Google Fonts.
 *
 * Every entry here must cover Google Fonts' `vietnamese` glyph subset — every published page
 * renders `lang="vi"` (see `render-page.ts`), so a font missing that subset silently drops
 * diacritics (tone marks, ơ/ư, etc.) for Vietnamese copy. Verified against
 * `fonts.google.com/metadata/fonts/<family>`'s `coverage` field: Lato, Poppins, and DM Sans were
 * previously listed here but only cover `latin`/`latin-ext` (Poppins also has `devanagari`), so
 * they were dropped in favor of Be Vietnam Pro and Manrope, which do cover `vietnamese`.
 */
export const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Work Sans",
  "Nunito",
  "Manrope",
  "Be Vietnam Pro",
  "Space Grotesk",
  "Playfair Display",
  "Merriweather"
] as const;
export type GoogleFont = (typeof GOOGLE_FONTS)[number];

const GOOGLE_FONT_SET: Set<string> = new Set(GOOGLE_FONTS);

/** First segment of a CSS font stack, e.g. `"Playfair Display, serif"` → `"Playfair Display"`. */
function fontFamilyName(fontStack: string): string {
  return (fontStack.split(",")[0] ?? "").trim();
}

/**
 * Google Fonts stylesheet URL for every curated font actually in use on the page: `fontHeading`/
 * `fontBody` plus, when `spec` is passed, any per-element `style["font-family"]` override set
 * from the block Inspector (`packages/studio-catalog/src/apply-element-style.tsx`) — those are
 * stored as a loose prop on each `PageSpec` element (`settings-tab.tsx`), not through the design
 * tokens, so without this scan a per-component font choice silently fell back to the browser
 * default (no stylesheet ever loaded it), even though the CSS applied the right `font-family`.
 * `spec` is optional since some callers (e.g. the AI brand-kit form) only ever have tokens, not
 * a page to scan. Names are deduped and, same as before, filtered against the curated allowlist
 * above before reaching a `<link href>`. Returns `null` if nothing in use matches the allowlist
 * (a page using only system fonts loads no external stylesheet).
 */
export function googleFontsHref(
  tokens: DesignTokens,
  spec?: Spec
): string | null {
  const families = new Set<string>();
  for (const stack of [tokens.fontHeading, tokens.fontBody]) {
    const name = fontFamilyName(stack);
    if (GOOGLE_FONT_SET.has(name)) families.add(name);
  }
  if (spec) {
    for (const element of Object.values(spec.elements)) {
      const style = (element.props as Record<string, unknown> | undefined)
        ?.style as Record<string, unknown> | undefined;
      const fontFamily = style?.["font-family"];
      if (typeof fontFamily !== "string") continue;
      const name = fontFamilyName(fontFamily);
      if (GOOGLE_FONT_SET.has(name)) families.add(name);
    }
  }
  if (families.size === 0) return null;
  const params = Array.from(families)
    .map((name) => `family=${encodeURIComponent(name)}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
