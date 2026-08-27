import type { DesignTokens } from "@dv/contracts";

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
 */
export const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Work Sans",
  "Nunito",
  "DM Sans",
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
 * Google Fonts stylesheet URL for whichever of `fontHeading`/`fontBody` match the curated
 * allowlist above, deduped, or `null` if neither does (a page using only system fonts loads no
 * external stylesheet). Used both for the live editor preview and — the part that actually
 * matters — the published page's own `<head>` (`packages/studio-render`), since a chosen Google
 * Font that's never loaded on the real site silently falls back to the browser default.
 */
export function googleFontsHref(tokens: DesignTokens): string | null {
  const families = new Set(
    [
      fontFamilyName(tokens.fontHeading),
      fontFamilyName(tokens.fontBody)
    ].filter((name) => GOOGLE_FONT_SET.has(name))
  );
  if (families.size === 0) return null;
  const params = Array.from(families)
    .map((name) => `family=${encodeURIComponent(name)}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
