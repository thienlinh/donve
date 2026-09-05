import { cloneElement, isValidElement, type ReactNode } from "react";

import type { StyleProps } from "./shared-props.js";

/** `StyleProps`/`InspectorValues` keys are kebab-case CSS property names (`InspectorPanel`
 * commits values already CSS-ready — e.g. `"400px"` for width, a bare number for unitless
 * `opacity`/`line-height` — so only the *keys* need converting; React's `style` prop rejects
 * kebab-case keys outright). Built once from a representative key list rather than a runtime
 * kebab-to-camel parser, since the key set is small and fixed. */
const CSS_KEY_TO_CAMEL: Record<keyof StyleProps, string> = {
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  color: "color",
  "text-align": "textAlign",
  "text-transform": "textTransform",
  "font-style": "fontStyle",
  "text-decoration": "textDecoration",
  "line-height": "lineHeight",
  "letter-spacing": "letterSpacing",
  width: "width",
  height: "height",
  "max-width": "maxWidth",
  "min-height": "minHeight",
  opacity: "opacity",
  overflow: "overflow",
  padding: "padding",
  margin: "margin",
  "border-width": "borderWidth",
  "border-color": "borderColor",
  "border-radius": "borderRadius",
  "background-color": "backgroundColor",
  "background-image": "backgroundImage",
  "box-shadow": "boxShadow",
  display: "display"
};

/** Applies a Settings-tab `style` prop onto a catalog component's rendered root element —
 * `cloneElement` rather than a wrapping `<div>`, since every component already renders exactly
 * one root element with its own hand-tuned Tailwind layout that a wrapper could disturb
 * (margin-collapse, `:first-child` selectors, flex/grid item context). Shared by both the Puck
 * editor canvas (`puck-config.tsx`) and the publish/SSR registry (`registry.ts`) — the two
 * places every catalog component's render output passes through — so no per-component edits. */
export function applyElementStyle(
  node: ReactNode,
  style: StyleProps | undefined
): ReactNode {
  if (!style || !isValidElement(node)) return node;
  const camelStyle: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(style)) {
    if (value === undefined || value === null) continue;
    const camelKey = CSS_KEY_TO_CAMEL[key as keyof StyleProps] ?? key;
    camelStyle[camelKey] = value;
  }
  // A plain `fontFamily` here only reaches descendants that inherit it — powerless against one
  // that already declares its own `font-family` (e.g. `hero.tsx`'s heading/body text binds
  // directly to `font-family:var(--lp-font-heading)`/`var(--lp-font-body)`, which as a literal
  // property on that element always wins over anything set on an ancestor). CSS custom
  // properties are different: they still cascade through such a `var(...)` reference, so
  // redefining the two variables here on this root reaches those elements too — a no-op
  // wherever nothing underneath references either variable.
  if (style["font-family"] !== undefined && style["font-family"] !== null) {
    camelStyle["--lp-font-heading"] = style["font-family"];
    camelStyle["--lp-font-body"] = style["font-family"];
  }
  const element = node as React.ReactElement<{ style?: React.CSSProperties }>;
  return cloneElement(element, {
    style: { ...element.props.style, ...camelStyle }
  });
}
