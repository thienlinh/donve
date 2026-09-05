---
name: ux-design-review
description: Lightweight UX/product design critique framework — verdict (Solid / Needs work / High risk), top issues by impact, concrete recommendations, not an exhaustive checklist dump. Use when reviewing a page or flow for usability rather than pure visual polish, including AI-feature-specific UX (agent inputs, trust builders, governors).
---

Source: https://github.com/tommyjepsen/awesome-ux-skills

## Format

State a verdict first: **Solid** (minor refinements), **Needs work** (usability concerns), or **High risk** (likely to fail for users). Then list only the top real issues with impact + concrete fix + open questions — never list all review lenses by default just to seem thorough.

## Pick the strongest lens for the context

- **Usability & conversion** — existing app flows, any landing page CTA flow.
- **Visual craft** — already-polished interfaces needing a final pass.
- **Accessibility** — WCAG-specific concerns (pair with `ai-friendly-web-design` skill).
- **Research & framing** — ambiguous/new feature, use the Double Diamond (Discover/Define/Develop/Deliver) to locate which phase the work is in.
- **Prioritization** — backlog/roadmap decisions, not a specific screen.
- **AI-specific checks** — for any agentic/AI feature (this repo has several: AI connections, prompt templates, studio chat panel): what can it change, send, delete, spend, remember, or reveal? Does it have clear inputs, wayfinding, tuners (adjustable behavior), governors (limits/guardrails), and trust builders (explainability, confirmation)?

## Core usability principles to check against

Clarity, appropriate language, user control, consistency, error prevention, recognition over recall, efficiency, focus, error recovery, contextual help — mention only the ones that are actually broken, not all ten by default.
