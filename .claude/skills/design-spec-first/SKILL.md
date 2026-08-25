---
name: design-spec-first
description: "Spec-first" workflow for landing pages and new visual surfaces — extract or define a DESIGN.md (color/type/component/layout/motion/depth/a11y/responsive spec) before writing any code, so the build strictly follows a declared system instead of improvising per-component. Use for new landing-page templates/PageSpec components and any greenlit visual redesign.
---

Source: https://github.com/xiaopu-ai/web-design

## Three-phase process

1. **Understand** — accept any input mix: reference URL, screenshot, keywords, or PRD. If a reference URL is given, extract its real design tokens (colors as CSS vars, type scale, spacing) rather than eyeballing it.
2. **Produce DESIGN.md** — a spec covering: visual theme, color palette (as tokens, zero hardcoded hex in the eventual code), typography, components, layout, depth/elevation, animation, accessibility guidelines, responsive behavior. Get this reviewed/confirmed before Phase 3.
3. **Generate code** strictly following the DESIGN.md — and self-audit the output against it before calling the work done (every color via variable, all interactive states present, responsive checked at mobile+desktop).

## Non-negotiable acceptance criteria

- All colors via CSS variables/tokens — zero hardcoded hex.
- Complete component states: hover, active, focus, disabled — not just the default state.
- Motion has a performance guardrail: limit heavy effects (backdrop-filter blur, WebGL), always provide a `prefers-reduced-motion` fallback.
- Responsive validated at both mobile and desktop, not just visually eyeballed at one width.

## Applying to this repo

Use this for new `packages/studio-catalog` PageSpec components/sections: write the section's DESIGN.md-equivalent (token usage, states, responsive behavior) before implementing the component, since `packages/studio-render` will SSR it at build time for real visitor traffic — mistakes ship directly to published landing pages.
