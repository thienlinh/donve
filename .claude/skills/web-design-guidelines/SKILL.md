---
name: web-design-guidelines
description: Audit UI code against Vercel's Web Interface Guidelines (accessibility, interaction, layout, forms, performance). Use when asked to "review my UI", "check accessibility", or "audit design" on apps/dashboard components.
---

Source: https://github.com/vercel-labs/agent-skills (skill: web-design-guidelines), guidelines pulled from https://github.com/vercel-labs/web-interface-guidelines

## When to use

Triggered by requests to review UI code, check accessibility, or audit a component/page's interface quality.

## Process

1. Before reviewing, fetch the latest guidelines from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/AGENTS.md` (or `command.md`) via WebFetch — do not rely on memorized rules, they get updated upstream.
2. If the user gave specific files/patterns, review those. Otherwise ask which files/route to review.
3. Evaluate the code against the fetched guidelines (interaction states, focus management, motion, forms, touch targets, loading/error/empty states, etc.)
4. Report findings in concise `file:line — issue — fix` format. Skip anything already compliant; don't pad with praise.

## Applying to this repo

- Cross-check findings against `packages/ui/README.md` (the DonVe token system) so fixes use existing tokens/components (`@dv/ui`) rather than inventing new ones.
- Respect the oxlint exceptions documented in `.claude/rules/tech-stack.md` (Base UI `render` prop, ref-in-render idiom) — don't flag those as violations.
