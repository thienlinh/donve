---
name: web-quality-audit
description: Post-redesign quality audit against Lighthouse-style checks — Core Web Vitals (LCP/INP/CLS), WCAG 2.2 accessibility, SEO, best practices. Use after finishing a redesign pass on a page, or when asked to audit performance/accessibility/SEO.
---

Source: https://github.com/addyosmani/web-quality-skills

## Checks (weighted)

- **Performance (40%)** — LCP < 2.5s, INP < 200ms, CLS < 0.1. Image compression/modern formats, JS minimization, font-loading strategy, lazy loading below the fold.
- **Accessibility (30%)** — perceivability/operability/understandability/robustness. Alt text, 4.5:1 contrast minimum, full keyboard navigation, correct ARIA (only where semantic HTML isn't enough).
- **SEO (15%)** — crawlability (robots.txt/sitemap — mostly N/A for the authenticated app, applies to public landing pages), title/heading structure, mobile responsiveness, structured data on public pages.
- **Best practices (15%)** — HTTPS, CSP headers, no intrusive interstitials, modern API usage.

## Severity & workflow

Label findings Critical / High / Medium / Low. Critical and High block a redesign from being called done; Medium/Low can be tracked as follow-ups. Report as `file:line — check — severity — fix`, not a generic checklist dump.

## Applying to this repo

Run this pass after any app page redesign, and especially after any landing-page PageSpec/template work in `packages/studio-catalog` / `packages/studio-render` since those ship to real visitors (unlike the internal app).
