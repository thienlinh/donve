---
name: ai-friendly-web-design
description: Build UI that stays usable by assistive tech, browser automation, and AI agents — semantic HTML first, no hover-only critical actions, accessible names on every control, state as readable text, filters/pagination reflected in the URL. Use when designing or reviewing forms, tables, or any interactive control.
---

Source: https://github.com/ianho7/ai-friendly-web-design-skill

## Principles

- Semantic HTML before ARIA; native elements before custom widgets.
- Map user tasks before proposing components — explicitly design loading, error, empty, and success states for every data view (relevant across nearly every `apps/dashboard/src/features/*` list/table page).

## Non-negotiables

- No critical action is hover-only.
- Every critical control has an accessible name (not just a visual label).
- Loading/error/success state is readable text, not just a spinner/color.
- Search, filter, sort, pagination reflected in the URL where practical — check this against TanStack Router search params usage in `leads`, `campaigns`, `prompt-templates`.
- No CAPTCHA or automation-blocking APIs unless explicitly requested.

## Review output format

Severity-labeled (High/Medium/Low), explain the accessibility/automation impact, give a concrete fix — not abstract advice. Use this format when reviewing dashboard pages post-redesign.

## Refactor mode

When redesigning an existing page: apply minimal patches, preserve interaction patterns unless the user explicitly approved a behavior change — a visual redesign should not silently change behavior.
