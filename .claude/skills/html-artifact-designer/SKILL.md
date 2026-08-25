---
name: html-artifact-designer
description: Expert-designer workflow for standalone HTML artifacts (landing pages, prototypes, posters, decks) — verify facts before designing around a named brand, gather real assets before defaulting to generic colors/fonts, declare the design system before building, offer 3 differentiated directions when the brief is vague. Use for landing-page concepting/mockups and any one-off visual artifact outside the main dashboard app.
---

Source: https://github.com/jiji262/claude-design-skill

## Seven-step workflow

1. Understand the ask (output type, fidelity, brand/system context).
2. Gather design context (existing UI kit/tokens, attached files/screenshots).
3. Declare the system (type scale, colors, layout rhythm, section patterns) before building.
4. Build iteratively — get a rough version in front of the user early.
5. If the brief is vague, present 3 differentiated directions (conservative → novel) with a one-sentence pitch each, rather than guessing.
6. Verify in a real browser: check console errors, test small viewports, click through primary flows.
7. Summarize briefly — caveats and next steps only, no feature tour.

## Core Asset Protocol (branded work)

Priority order: real logo → real product/UI screenshots → colors/fonts. Never default straight to generic colors — that's how everything ends up looking the same. For DonVe-branded surfaces, source assets from `packages/ui/src/assets/brand/` first.

## Avoid

Aggressive gradients, emoji bullets, rounded-card clichés, generic font stacks (Inter/Roboto) unless the brand spec calls for them, fake imagery (use honestly-labeled placeholders), filler content (lorem ipsum, invented stats).

## Boundaries

Never recreate a real third party's proprietary branded UI without rights to that design.
