---
name: taste-frontend
description: Anti-AI-slop design discipline for landing pages, operational apps, and redesigns — three dials (variance/motion/density), a pre-flight checklist banning generic LLM design tells (purple gradients, three-equal-card grids, em-dashes, warm-beige premium palette). Use when designing or redesigning any visual surface, especially landing pages and marketing UI.
---

Source: https://github.com/Leonxlnx/taste-skill

## Core method

1. **Design read** — before any code, write one line inferring the brief's true intent (audience, tone, category convention to honor or break).
2. **Three dials**, set explicitly per project and kept consistent across the surface:
   - **Variance** — how far to deviate from the safe default layout.
   - **Motion intensity** — how much animation is justified.
   - **Visual density** — how much content per viewport.
3. **Pick one design system per project, don't mix.** For the DonVe app this repo already has one: `@dv/ui` (shadcn "base-nova" + DonVe tokens in `packages/ui/src/styles/globals.css`). For net-new landing-page aesthetics without an official package, build with Tailwind + honestly-labeled approximations.

## Hard bans (pre-flight checklist)

- Em-dashes in generated copy.
- Duplicate CTA intent on the same view.
- Three-equal-column feature cards as the default layout.
- "Warm beige + brass + oxblood" as a default premium palette — pick from the actual `packages/ui` token set instead.
- Serif fonts as a default "creative" signal — deliberate choice only.
- Purple/pink gradients, Inter-by-default, emoji bullets, rounded-card-everything.

## Requirements

- One accent color per page/view, applied consistently — pull from `packages/ui` semantic tokens (`brand`, `ai`, `integration`, `automation`), don't invent new hex values.
- Every animation must justify itself in one sentence (hierarchy / narrative / feedback / state change) — no motion for decoration.
- Long lists/specs/testimonials get card grids or grouped chunks, never a bare `<ul>` + `divide-y`.
- Real imagery or honest placeholders (`[image: 16:9, product screenshot]`) — never fake it.

## Redesign audit protocol (for existing app pages)

Before restyling an existing feature: extract its current brand tokens and information architecture first (what data/actions does the page actually need to expose), then design visuals — don't restyle blind.
