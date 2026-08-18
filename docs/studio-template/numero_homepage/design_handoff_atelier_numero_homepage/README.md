# Handoff: Atelier Numéro — Homepage (N°07 "The Cashmere Issue")

## Overview

A single, long-scroll homepage for **Atelier Numéro**, a fictional French/Italian slow-fashion house. The page is styled as a printed magazine issue ("N°07 · The Cashmere Issue") and moves the visitor from cover → table of contents → product edit → editorial feature → journal → newsletter → footer. Tone is editorial, restrained, and typographically-driven; commerce is present but understated.

## About the Design Files

The file inside `design/` (`index.html` + `assets/`) is a **design reference created in HTML** — a static prototype showing the intended look, layout, copy and hover behavior. It is **not production code to ship**. The task is to **recreate this design in the target codebase's existing environment** (Next.js/React, Astro, Nuxt, Shopify Liquid, Rails/ERB, etc.), using the app's established component patterns, design tokens, image pipeline, and CMS/data layer.

If no codebase exists yet, pick the framework best suited to the project (Next.js + Tailwind is a strong default for an editorial-commerce page like this) and implement the designs there.

## Fidelity

**High-fidelity (hifi).** Colors, typography, spacing, image crops, hover states, and responsive breakpoints are final. Recreate pixel-perfect where the target codebase allows. All copy in the mock is intended as final placeholder copy for a fictional November issue — replace only when real editorial content is available.

---

## Design Tokens

### Colors (CSS custom properties, from `:root`)

| Token | Hex | Usage |
| --- | --- | --- |
| `--paper` | `#f4eee5` | Page background (warm ivory) |
| `--paper-2` | `#ece4d6` | Editorial section background (slightly darker paper) |
| `--ink` | `#1a1612` | Primary text, top strip, newsletter section bg |
| `--ink-soft` | `#5a534a` | Secondary text, meta, captions |
| `--line` | `#d6cdbb` | Dividers, hairlines, borders |
| `--rouge` | `#8e2a2a` | Accent — issue number, drop cap, hover for footer links |
| `--gold` | `#a07e3e` | Accent — "Atelier" product tag, newsletter eyebrow |

### Typography

Two Google Fonts:

- **Fraunces** — serif display + editorial body. Weights 300/400/500/600, italic 300/400. Optical sizing 9..144 enabled. Used for wordmark, headlines, prices, drop caps, editorial paragraphs.
- **DM Sans** — sans-serif UI + secondary. Weights 300/400/500. Used for nav, eyebrows, meta labels, product sub-labels, footer links, buttons.

Type patterns:

- **Eyebrow / meta**: DM Sans, 11px, uppercase, letter-spacing `0.18em–0.22em`, color `--ink-soft` (or `--rouge`/`--gold` at accent locations).
- **Wordmark**: Fraunces 400, 36px, letter-spacing `-0.01em`; italic 14px issue line beneath (`letter-spacing: 0.3em`).
- **Cover H1**: Fraunces 300, fluid `clamp(64px, 9vw, 132px)`, line-height `0.92`, letter-spacing `-0.03em`. Word "soft" is italic 400. A trailing subtitle line uses `font-size: 0.42em` italic 300 in `--ink-soft`.
- **Section H2** (Index, Collection, Editorial, Journal, Newsletter): Fraunces 300, sizes 56 / 80 / 64 / 64 / 72 px respectively, line-height `~0.95–1`, letter-spacing `-0.02em to -0.025em`. Emphasized words wrapped in `.it` are italic.
- **Cover lede & editorial body**: Fraunces italic 300, 22px cover / 19px editorial, line-height `1.5–1.55`, color `--ink-soft`.
- **Product name**: Fraunces 400, 18px; sub-label DM Sans 11px uppercase, letter-spacing `0.14em`, `--ink-soft`.
- **Price**: Fraunces italic 400, 18px.
- **Editorial drop cap**: first letter of the first `<p>` inside `.ed-text`, `font-size: 5em`, italic, `line-height: 0.85`, floated left, color `--rouge`.

### Spacing & Layout

- Page container: `max-width: 1400px`, horizontal padding `40px` (desktop) / `20px` (mobile ≤640px).
- Section vertical padding (desktop → mobile):
  - Cover: `60px 0 80px` → `40px 0 50px`
  - Index: `60px 0`
  - Collection: `120px 0` → `70px 0`
  - Editorial: `100px 0` → `70px 0`
  - Journal: `120px 0` → `70px 0`
  - Newsletter: `120px 0` → `80px 0`
  - Footer: `80px 0 32px` → `50px 0 24px`
- Grid patterns:
  - Cover: `1.1fr 1.4fr`, gap `60px` → single column, gap `32px`.
  - Index: `1fr 3fr` heading / list, list is 2-col `60px` gutter → single column.
  - Collection: 4 cols → 2 cols ≤1024px, gap `30px 24px` → `24px 16px`.
  - Editorial: `1fr 1fr`, gap `80px` → single column, gap `40px`.
  - Journal: 3 cols → 1 col ≤1024px, gap `40px` → `36px`.
  - Footer: `2fr 1fr 1fr 1fr 1fr` → `2fr 1fr 1fr` at 1024 → `1fr 1fr` at 640 (brand column spans full width).

### Radii, Borders, Shadows

- No shadows anywhere. The design is deliberately flat/matte to feel like print.
- Only **one** rounded shape: the `.pill-cta` buttons — `border-radius: 999px`.
- Hairline dividers: `1px solid var(--line)`.
- `.arrow-btn` circular controls: `48px × 48px`, `border-radius: 50%`, `1px solid var(--ink)`.

### Motion

- All interactive transitions: `0.25s` (buttons/arrows) or `0.3–0.4s` (image lift). No custom easing curve declared — browser default (`ease`) is intentional.
- Product card hover: `.prod-img { transform: translateY(-4px); }`.
- Journal card hover: same `translateY(-4px)` lift.
- Pill CTA hover: fill flips (bg → `--ink`, text → `--paper`); the `↗` arrow translates `3px, -3px` (up-right).
- Solid pill CTA on hover: bg + border become `--rouge`.
- Arrow buttons on hover: invert (fill `--ink`, text `--paper`).
- Footer link hover: text becomes `--rouge`.

---

## Sections / Views

The page is a single scrollable route. Each section below corresponds to one `<section>` in `design/index.html`. All copy shown is final for the mock.

### 1. Top Strip

- Full-width band, `background: --ink`, `color: --paper`, `padding: 10px 0`, centered.
- 11px uppercase DM Sans, letter-spacing `0.2em`.
- Copy: `Complimentary worldwide delivery · Atelier returns within 30 days · N°07 launches November 14`
- On mobile (≤640px): font-size 9px, letter-spacing 0.15em, allows wrap on two lines.

### 2. Masthead

- White (`--paper`) band with a bottom hairline.
- **Primary row** (`display: flex; justify-content: space-between; align-items: center`):
  - **Left nav** (`.ms-left`, DM Sans 13px, `--ink-soft`): `Shop · Journal · Atelier · Stockists`, `gap: 28px`.
  - **Wordmark** (center, flex 0 0 auto): `Atelier Numéro` in Fraunces 400, 36px, with a small italic block below reading `N°·07·MMXXVI` (14px, letter-spacing 0.3em, `--ink-soft`).
  - **Right nav** (`.ms-right`, right-aligned): `Search · Account · Bag (0)`.
  - Left/right navs hide on mobile ≤640px; wordmark centers.
- **Sub-nav** (`.sub-nav`, centered under the primary row, `margin-top: 18px`):
  - `Women · Men · Cashmere · Tailoring · Leather · Objects · Archive`
  - DM Sans 12px, uppercase, letter-spacing `0.15em`, `--ink-soft`.
  - Current item (`Women` in the mock) uses class `.active` → color `--ink`.
  - Mobile: horizontally scrollable, font 10px, gap 14px, hides scrollbar.

### 3. Cover

- Two-column layout inside `.container`.
- **Left column (`.cover-text`, `padding: 40px 0`)**:
  1. `.cover-meta` — 3 spans in a `space-between` row above a hairline: `Cover · N°07` · `The Cashmere Issue` · `FW · 2026`. 11px uppercase, `--ink-soft`, `margin-bottom: 60px`, bottom border `--line`.
  2. `.cover-issue` — Fraunces italic 18px, color `--rouge`: `— The November Edit, in three acts.`
  3. `<h1>` (see typography above): `The soft economy.` — "soft" italic, `<br>`, then small subtitle line `A study in weight, drape and quiet luxury.`
  4. `.cover-lede` (max-width 460px): _"Twelve garments, woven across three ateliers in Umbria and Inner Mongolia. A wardrobe that asks nothing of you — and gives, generously."_
  5. `.cover-cta` — two `.pill-cta` buttons side by side: **Shop the issue ↗** (solid variant, `bg: --ink`) and **Read the editor's letter** (outline). Mobile: stacks full-width.
- **Right column (`.cover-image`)**:
  - Aspect ratio `4 / 5`.
  - Background image: `assets/img/02-atelier-cover.jpg`, positioned `center 28%`, sized `115% auto` (slight zoom + upward crop).
  - Overlay: a top-heavy gradient `linear-gradient(180deg, rgba(42,31,24,0.95) 0%, transparent 18%, transparent 65%, rgba(0,0,0,0.5) 100%)` — darkens both top and bottom for caption legibility.
  - `.ci-cap` at bottom (24px inset): two spans, `space-between`. Left: `Photographed by` (11px uppercase, --paper). Right: `Inès Marchetti, Milan` (Fraunces italic, no uppercase).

### 4. Index (Table of Contents)

- Section has both top and bottom hairlines.
- Two columns: heading `<h2>In this issue</h2>` (Fraunces 300, 56px, "issue" italic) on the left; a 2-column list on the right.
- List rows (`.ix-item`) — 6 items in the mock. Each row is a 3-column grid: `36px 1fr 60px`, bottom hairline, `padding: 18px 0`.
  - Column 1 (`.n`): roman-numeral index (`i.` – `vi.`) in Fraunces italic 14px, color `--rouge`.
  - Column 2 (`.t`): item title (Fraunces 19px) with a `<small>` line below (DM Sans 12px, `--ink-soft`, uppercase-ish label like _"The Garment · N°07"_).
  - Column 3 (`.p`): right-aligned action or price — `€2,480`, `Read`, `Visit`, `Shop`, `Watch`. DM Sans 13px, letter-spacing 0.08em, `--ink-soft`. Hidden on mobile.
- List content (in order):
  1. `i.` The double-faced overcoat — The Garment · N°07 — `€2,480`
  2. `ii.` A treatise on the cardigan — The Journal · 14 min read — `Read`
  3. `iii.` Cashmere from Alashan — The Source · Inner Mongolia — `Visit`
  4. `iv.` Twelve ways to wear ivory — The Edit · Curated — `Shop`
  5. `v.` Inside the Perugia atelier — The Film · 6:42 — `Watch`
  6. `vi.` A wardrobe in three colours — The Essay · Words by S. Aoki — `Read`

### 5. Collection ("The November edit.")

- **Header row** (`.col-head`, `align-items: flex-end`, margin-bottom 60px):
  - Left: `<h2>The November edit.</h2>` — "November" italic, Fraunces 300, 80px, `<br>` before "edit."
  - Right: `.nav-arrows` — two `.arrow-btn` circles containing `←` and `→` (48×48, 1px `--ink` border). These are static in the mock; wire them up to a carousel or lazy pagination.
  - Mobile: header stacks column, arrows below title.
- **Grid** (`.col-grid`): 4 columns desktop, 2 columns ≤1024px, gap `30px 24px` → `24px 16px`.
- **Product card** (`.prod`) — 8 cards in the mock. Each card:
  - `.prod-img` — aspect `4/5`, image via inline `background` (see Assets table below).
    - Subtle dot-texture overlay: `radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)` at 3px × 3px, `mix-blend-mode: multiply`, opacity 0.4 — gives a paper-halftone feel.
    - `.tag` positioned `top: 14px; left: 14px`, `background: --paper`, `padding: 5px 10px`, 10px uppercase, letter-spacing 0.18em.
    - `.tag.gold` variant: `background: --ink`, `color: --gold`.
    - Hover: entire `.prod-img` translates up 4px over 0.4s.
  - `.prod-meta` — flex `space-between`, `align-items: baseline`. Left: product name (Fraunces 18px) + sub-label small (DM Sans 11px uppercase, --ink-soft). Right: price (Fraunces italic 18px).
- **Products (8)** — final copy + files:

  | # | Name | Sub-label | Tag | Price | Image |
  | --- | --- | --- | --- | --- | --- |
  | 1 | The Adèle Coat | Double-faced cashmere | `New` | €2,480 | `assets/img/prod/02-coat.jpg` |
  | 2 | The Mira Knit | Hand-finished, Umbria | `Atelier` (gold) | €890 | `assets/img/prod/02-knit.jpg` |
  | 3 | The Béatrice Trouser | Wool-cashmere flannel | `N°07` | €620 | `assets/img/prod/02-trouser.jpg` |
  | 4 | The Otto Loafer | Hand-stitched, Florence | `Last pieces` | €540 | `assets/img/prod/02-loafer.jpg` |
  | 5 | The Lior Cardigan | 10-gauge cashmere | `New` | €720 | `assets/img/prod/02-cardigan.jpg` |
  | 6 | The Inès Scarf | 200 × 70 cm, fringed | `N°07` | €340 | `assets/img/prod/02-scarf.jpg` |
  | 7 | The Sora Bag | Vegetable-tanned calf | `Atelier` (gold) | €1,180 | `assets/img/prod/02-bag.jpg` |
  | 8 | The Réal Blouse | Silk crêpe de chine | `New` | €480 | `assets/img/prod/02-blouse.jpg` |

### 6. Editorial ("A fibre finer than thought.")

- Section background switches to `--paper-2` (`#ece4d6`).
- Two columns (`.ed-grid`), `align-items: center`, gap 80px:
  - **Left**: `.ed-image`, aspect `4/5`, background `assets/img/02-atelier-editorial.jpg`, `center / cover`.
  - **Right (`.ed-text`)**:
    - Eyebrow (`--rouge`, 11px, 0.22em): `— The Source · Alashan, Inner Mongolia`
    - `<h2>A fibre finer than thought.</h2>` — "finer" italic, Fraunces 300, 64px.
    - Two `<p>` (Fraunces 19px italic-free, `--ink-soft`, line-height 1.55). First paragraph has class `first` — its first letter becomes a 5em italic rouge drop cap floated left with `padding: 0 12px 4px 0`.
      - P1: _"For four generations, the herders of the Alashan plateau have combed — never sheared — the under-fleece of the capra hircus during the brief two-week window that follows the first thaw of April."_
      - P2: _"What they gather, by hand and at altitude, measures fourteen-and-a-half microns. It is what makes the Adèle coat fall the way it does, and the Mira knit feel like nothing at all."_
    - `.by` line, 11px uppercase, `--ink-soft`, margin-top 28px: `— Words by Sora Aoki · Photography by Wen Li`
  - Mobile: single column, gap 40px, h2 drops to 40px, paragraphs to 17px.

### 7. Journal ("Three stories this week.")

- Centered header:
  - Eyebrow `--rouge`: `— From the Journal`
  - `<h2>Three stories this week.</h2>` — "stories" italic, Fraunces 300, 64px.
- 3-column grid (`.jr-grid`), collapses to 1 column ≤1024px.
- Each card (`.jr-card`, cursor: pointer):
  - `.img` aspect `5/4`, background image (see Assets), hover translates up 4px.
  - `.meta` — 11px uppercase, letter-spacing 0.18em, `--ink-soft`: e.g. `The Essay · 8 min`.
  - `<h3>` Fraunces 400, 24px, line-height 1.15. Words wrapped in `.it` become italic.
  - `<p>` DM Sans 14px, `--ink-soft`, line-height 1.5.
- Cards (in order):
  1. `The Essay · 8 min` — **The _quiet_ wardrobe: an argument for less, finer.** — "Twelve pieces. One palette. A year of getting dressed without thinking." — image `assets/img/jr/02-essay.jpg`.
  2. `The Studio · 12 min` — **Inside the Perugia atelier with _Mira Conti_.** — "Where the November edit was made — by twenty-six hands, over three months." — image `assets/img/jr/02-studio.jpg`.
  3. `The Care · 4 min` — **How to _wash_ cashmere, and how not to.** — "A short guide, written by the people who weave it." — image `assets/img/jr/02-care.jpg`.

### 8. Newsletter

- Section: `background: --ink`, `color: --paper`, `padding: 120px 0`, `overflow: hidden`, `position: relative`.
- Decorative `::before`: the glyph `N°` centered absolutely, Fraunces italic 300, `font-size: 600px`, color `rgba(255,255,255,0.03)` — a very faint watermark behind the form. Mobile: 360px.
- Content (`.news-wrap`, max 700px, centered):
  - Eyebrow color `--gold`: `— The Letter`
  - `<h2>A monthly dispatch.</h2>` — "monthly" italic, Fraunces 300, 72px (44px mobile).
  - `<p>` `rgba(255,255,255,0.6)`, 16px, max 460px: _"One essay, one garment, one place — sent the first Sunday of each month. No noise, no urgency, ever."_
  - `.news-input` — a form with a single-line underline treatment (`border-bottom: 1px solid rgba(255,255,255,0.3)`, `padding-bottom: 4px`, max-width 480px):
    - `<input type="email">` — transparent background, no border, Fraunces 20px, placeholder `your address, please` (italic, rgba 0.4).
    - `<button type="submit">` — transparent, `--gold`, DM Sans 12px uppercase, `Subscribe ↗`.
    - On submit (mock behavior): button text becomes `Thank you`, input clears. Wire this to the real newsletter provider (Klaviyo, Mailchimp, Customer.io, etc.) via a POST in the target codebase.

### 9. Footer

- Top hairline. 5-column grid (`.ft-grid`, `2fr 1fr 1fr 1fr 1fr`, gap 60px).
- **Column 1 (Brand)**: `.ft-brand` — `Atelier Numéro` Fraunces 300, 44px, with italic subtitle `N°·07·MMXXVI` (14px, letter-spacing 0.3em, --ink-soft). Below: `.ft-blurb`, Fraunces italic 15px, --ink-soft, max-width 280px: _"A small atelier, making fewer, finer things from rue Saint-Honoré, Paris."_
- **Columns 2–5** — each has an `<h4>` (11px uppercase, letter-spacing 0.18em, --ink-soft) and a `<ul>` (14px DM Sans, link hover → --rouge):
  - **Shop**: Women · Men · Atelier · Archive · Gift cards
  - **Service**: Delivery · Returns · Care · Repair · Sizing
  - **Atelier**: Our story · Journal · Stockists · Press
  - **Connect**: Instagram · Newsletter · Contact
- **`.ft-bot`** — top hairline, flex `space-between`, 11px uppercase, --ink-soft:
  - Left: `© MMXXVI Atelier Numéro · Paris · Tokyo · Milan`
  - Right: `Made, slowly, in Europe`
- Mobile ≤640px: 2-column grid, brand column spans full width. Bottom row stacks and centers.

---

## Interactions & Behavior

- **Navigation** (masthead + sub-nav + footer links): route to the corresponding pages (shop category, journal index, atelier story, etc.). None are wired in the mock — every `<a>` uses `href="#"`.
- **Search / Account / Bag** (top-right): open the corresponding drawer or route (`/search`, `/account`, `/cart`). Bag counter (`Bag (0)`) is bound to cart line-item count.
- **Cover CTAs**:
  - Solid **Shop the issue ↗** → `/collections/n07` (or equivalent).
  - Outline **Read the editor's letter** → `/journal/editors-letter-n07`.
- **Index list**: each row links to the referenced page (product, essay, film, source story, edit).
- **Collection arrows**: currently visual only. Wire to a horizontal scroll paginator, an infinite-load, or a route to the full collection index — coordinate with product before choosing.
- **Product cards**: entire card is a link to the product detail page (`/products/adele-coat`, etc.). Card lift on hover (`translateY(-4px)` over 0.4s) is preserved.
- **Journal cards**: entire card links to the article. Same 4px lift on hover.
- **Newsletter form**: intercept submit, POST email to newsletter provider, show inline success by swapping the button label to `Thank you` and clearing the input. Show inline error state (color `--rouge`) if the POST fails or the email is invalid.
- **All hover transitions**: 0.25s default; image lifts 0.3–0.4s.

### State Management

Minimal client state; most of the page is static content best sourced from a CMS. State needed:

- **Cart line-count** (top-right `Bag (n)`) — from cart store.
- **Newsletter submit** — local component state (`idle | submitting | success | error`).
- **Optional carousel state** — if the November edit is turned into a paginated/horizontal-scroll carousel.

### Data Fetching

Nothing is fetched in the mock. In production:

- **Issue** (cover image, issue meta, editor's letter link) — from CMS (Sanity, Contentful, Prismic).
- **Products** (8 cards) — from commerce backend (Shopify Storefront API, BigCommerce, custom).
- **Journal posts** (3 cards) — from CMS.
- **Editorial feature** — from CMS.
- Consider caching / ISR (Next.js `revalidate: 3600`) — this page changes on an issue cadence, not per request.

### Responsive Behavior

Two breakpoints declared:

- **≤ 1024px**: Collection collapses to 2 cols; Journal to 1 col; Footer to 3 cols; Index list to 1 col.
- **≤ 640px**: All grids collapse to 1 (or 2 for Collection). Masthead side-navs hide; sub-nav becomes horizontally-scrollable; type scales down (see per-section notes above); CTAs stretch full-width; footer bottom stacks & centers.

Preserve intent, not exact pixel values, in the target framework — use its tokens.

---

## Assets

All bundled in `design/assets/img/`. These are the crops used in the mock; the developer is free to replace them with production photography or a CMS-driven pipeline (Shopify CDN, Sanity image, Cloudinary, `next/image`) as long as aspect ratios and crop intent are preserved.

| File | Where used | Aspect / Notes |
| --- | --- | --- |
| `assets/img/02-atelier-cover.jpg` | Cover right column (`.cover-image`) | 4:5. Positioned `center 28%`, scaled 115% — the subject sits slightly above center. Overlaid with a top+bottom dark gradient for caption legibility. |
| `assets/img/02-atelier-editorial.jpg` | Editorial left column (`.ed-image`) | 4:5, `center / cover`. |
| `assets/img/jr/02-essay.jpg` | Journal card 1 | 5:4, `center / cover`. |
| `assets/img/jr/02-studio.jpg` | Journal card 2 | 5:4, `center / cover`. |
| `assets/img/jr/02-care.jpg` | Journal card 3 | 5:4, `center / cover`. |
| `assets/img/prod/02-coat.jpg` | Product 1 – The Adèle Coat | 4:5 |
| `assets/img/prod/02-knit.jpg` | Product 2 – The Mira Knit | 4:5 |
| `assets/img/prod/02-trouser.jpg` | Product 3 – The Béatrice Trouser | 4:5 |
| `assets/img/prod/02-loafer.jpg` | Product 4 – The Otto Loafer | 4:5 |
| `assets/img/prod/02-cardigan.jpg` | Product 5 – The Lior Cardigan | 4:5 |
| `assets/img/prod/02-scarf.jpg` | Product 6 – The Inès Scarf | 4:5 |
| `assets/img/prod/02-bag.jpg` | Product 7 – The Sora Bag | 4:5 |
| `assets/img/prod/02-blouse.jpg` | Product 8 – The Réal Blouse | 4:5 |

### Fonts

Loaded from Google Fonts. In production, self-host with `next/font/google` or an equivalent to avoid render-blocking + FOUT:

- Fraunces: `ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400`
- DM Sans: `wght@300;400;500`

### Icons

No icon library. The only glyphs are Unicode arrows (`←`, `→`, `↗`) and typographic marks (`·`, `—`, `°`). Do not swap these for icons from a set — the typographic feel is intentional.

---

## Files

Everything needed to reference the design lives under `design/`:

```
design_handoff_atelier_numero_homepage/
├── README.md                              ← this file
└── design/
    ├── index.html                          ← the full homepage prototype (all CSS inline in <style>)
    └── assets/
        └── img/
            ├── 02-atelier-cover.jpg
            ├── 02-atelier-editorial.jpg
            ├── jr/
            │   ├── 02-essay.jpg
            │   ├── 02-studio.jpg
            │   └── 02-care.jpg
            └── prod/
                ├── 02-coat.jpg
                ├── 02-knit.jpg
                ├── 02-trouser.jpg
                ├── 02-loafer.jpg
                ├── 02-cardigan.jpg
                ├── 02-scarf.jpg
                ├── 02-bag.jpg
                └── 02-blouse.jpg
```

Open `design/index.html` directly in a browser to see the mock. All styles are declared inline in the `<style>` block at the top of that file — no build step required to view.

---

## Implementation Notes (for the developer)

- **Component split (suggested)**: `TopStrip`, `Masthead` (`PrimaryNav`, `Wordmark`, `SubNav`), `Cover`, `IssueIndex`, `Collection` (`ProductCard`), `EditorialFeature`, `JournalGrid` (`JournalCard`), `Newsletter`, `SiteFooter`. All are stateless except `Newsletter`.
- **Data shapes**:
  ```ts
  type Product = {
    id;
    name;
    subLabel;
    tag: "New" | "Atelier" | "N°07" | "Last pieces";
    price;
    imageUrl;
    href;
  };
  type IndexRow = {
    numeral: string;
    title: string;
    subLabel: string;
    action: string;
    href: string;
  };
  type JournalPost = {
    category: string;
    readTime: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    href: string;
  };
  ```
- **Image treatment**: the halftone dot texture over product images is done in CSS with a `radial-gradient` background and `mix-blend-mode: multiply`. Keep it — it's core to the print aesthetic. When the underlying element becomes an `<img>` instead of a background, apply the overlay as a sibling `::after` with `position: absolute; inset: 0`.
- **Cover image gradient**: the gradient overlay is a pure `::after` and can be reused verbatim.
- **Drop cap**: `::first-letter` on the first paragraph of `.ed-text`. If the CMS renders the first paragraph as multiple nodes, add an explicit class rather than relying on `:first-of-type`.
- **`clamp()` cover H1**: `clamp(64px, 9vw, 132px)`. Preserve.
- **Do not introduce shadows, gradients, or rounded corners** beyond what is documented. The restraint is the brand.
- **French typography**: em-dashes (`—`), non-breaking spaces around `°`, italic accent words, roman numerals. Preserve them; they are the design.
