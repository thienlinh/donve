---
name: frontend-aesthetic-philosophies
description: Named aesthetic directions (Dieter Rams functionalist, Swiss/International, Japanese minimalism, Brutalist, Scandinavian, Art Deco, Neo-Memphis, Editorial) to pick a deliberate visual direction instead of generic AI-default styling. Use when starting a redesign and a concrete style direction hasn't been chosen yet, or when presenting style options to the user.
---

Source: https://github.com/julianoczkowski/designer-skills (skill: frontend-design)

## Before picking a direction

Explore the existing codebase first: component library (`@dv/ui`), CSS tokens (`packages/ui/src/styles/globals.css`), Tailwind setup, font loading, existing layout/spacing conventions. A redesign should pick ONE philosophy and apply it consistently, respecting tokens already defined rather than replacing them wholesale (this repo already has a token system — extend it, don't fork it).

## The philosophies (pick one per surface, name it explicitly to the user)

1. **Dieter Rams / Functionalist** — "less but better." Minimal, near-monochromatic, strict grids, zero decoration without purpose.
2. **Swiss/International** — objectivity via rigid grid, dramatic type scale, high contrast, bold color blocks.
3. **Japanese Minimalism** — negative space as content, extreme whitespace, muted naturals, slow/gentle motion.
4. **Brutalist** — visible structure, anti-aesthetic aesthetic, system fonts, exposed box model.
5. **Scandinavian** — warmth + restraint, rounded sans, natural palette, soft shadows, accessible-by-default.
6. **Art Deco** — bold symmetry, geometric display faces, rich colors, metallic accents.
7. **Neo-Memphis** — playful, clashing fonts, bold primaries, broken grids, bouncy motion.
8. **Editorial/Magazine** — content-led, display serifs, dramatic scale, full-bleed images.

## Rules regardless of philosophy

- Mobile-first: single column at 375px, scale up progressively.
- Avoid generic AI aesthetics: purple gradients, Inter-as-default, predictable equal-width cards.
- Dark mode via CSS variables (this repo already does warm near-black, not pure black — see `packages/ui/README.md`), maintain contrast ratios.
- Motion matches the chosen philosophy's energy — don't add unrelated animation.

## For this project specifically

A DonVe dashboard page should default to the existing token system (functionally closest to Scandinavian-with-brand-accents per `packages/ui/README.md`) unless the user explicitly asks for a different philosophy on a specific surface (e.g. landing pages can diverge more than internal dashboard screens).
