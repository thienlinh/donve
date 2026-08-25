import type { DesignTokens } from "@dv/contracts";

export { designTokensSchema, type DesignTokens } from "@dv/contracts";

/** Neutral fallback tokens — used wherever a page/preview has no tenant-specific brand yet
 * (manual page creation, component-preview e2e fixtures). */
export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  colorPrimary: "#111827",
  colorPrimaryForeground: "#ffffff",
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
  return `:root{--lp-color-primary:${tokens.colorPrimary};--lp-color-primary-foreground:${tokens.colorPrimaryForeground};--lp-color-surface:${tokens.colorSurface};--lp-color-foreground:${tokens.colorForeground};--lp-color-muted:${tokens.colorMuted};--lp-color-border:${tokens.colorBorder};--lp-font-heading:${tokens.fontHeading};--lp-font-body:${tokens.fontBody};--lp-radius:${tokens.radius};}`;
}
