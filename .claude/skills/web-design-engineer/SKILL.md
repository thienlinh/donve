---
name: web-design-engineer
description: Workflow for turning a design brief into polished frontend work — verify facts before designing around a named product/brand, declare the design system upfront, ship a rough v0 before full build, avoid AI-cliche visuals. Use for any non-trivial new page, dashboard redesign, or landing page build.
---

Source: https://github.com/ConardLi/garden-skills (skill: web-design-engineer)

## Workflow

1. **Verify facts first.** If the brief names a real product/brand/SDK, check it (WebFetch/WebSearch) before assuming details — prevents rework on false premises.
2. **Design Read + five dials** — before picking tokens, state: visual-variance, motion-intensity, information-density, asset-dependence, brand-fidelity.
3. **Declare the system upfront** in a short markdown block (color, typography, spacing, radius, shadow, motion) — for this repo, that means citing which `packages/ui` tokens/components you're using, and pause for confirmation on anything net-new before writing code.
4. **Show a rough v0 early** with placeholders and stated assumptions, so direction can be corrected before investing in full build.
5. **Asset > spec** — for branded work, source real logos/screenshots (repo's `packages/ui/src/assets/brand/`), document them, don't fabricate via CSS silhouettes.

## Avoid

Purple-pink gradients, emoji filler, rounded-card-everything unless the token system calls for it. Missing icons/images get honest placeholders, not fabricated fakes.

## React-specific technical notes

No inline `const styles = {...}` as a stray global; keep styling in Tailwind classes or CSS modules consistent with the rest of `apps/dashboard`.

## Pre-delivery checklist

Facts verified, dials applied, existing component contracts unbroken, responsive behavior checked, all interaction states (hover/active/focus/disabled/loading/error/empty) covered, no cliches shipped.
