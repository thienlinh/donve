import type { Spec } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import { renderToStaticMarkup } from "react-dom/server";

import { registry } from "./registry.js";

/**
 * Publish-time SSR — `Renderer` needs its context providers even for a static, non-interactive
 * render (validated via spike: bare `<Renderer>` throws `useVisibility must be used within a
 * VisibilityProvider`). `studio-render` (next roadmap step) wraps this with asset hashing,
 * design-token `<style>` injection, and minification.
 */
export function renderSpecToHtml(spec: Spec): string {
  return renderToStaticMarkup(
    <JSONUIProvider registry={registry}>
      <Renderer spec={spec} registry={registry} />
    </JSONUIProvider>
  );
}
