# Handoff: Penang Street Feast 2027 — Event Poster

## Overview

A single-page portrait event poster promoting **Penang Street Feast '27**, a two-night street-food festival in George Town, Penang, Malaysia (Mon 9 – Tue 10 August 2027). The poster leads with a full-bleed photograph of sizzling satay skewers on a charcoal grill at a night market; typography sits on the dark upper half of the image and a scrim'd lower band carries date, venue, hours, and ticket info.

The design is intended for:

- Print (A3 / A2 posters, flyers, wheat-paste)
- Digital OOH (portrait screens)
- Social share cards (crop as needed)

## About the Design Files

The files in this bundle are **design references created in HTML** — a static, pixel-locked prototype showing intended composition, colours, typography, imagery treatment and copy. **They are not production code to ship as-is.**

The task is to **recreate this design in the target codebase's environment** using its established patterns:

- If the target is a **web/marketing site** (Next.js, Astro, plain HTML, etc.), rebuild it as a component/section using the site's design tokens and font pipeline.
- If it is going to **print**, the layout should be re-composed in InDesign / Figma / Affinity Publisher at the correct physical dimensions and CMYK colour space using the tokens listed below as reference.
- If there is no target environment yet, the HTML in this folder can be used directly as the source of truth — but replace the CDN-hosted Google Fonts with self-hosted `.woff2` files for reliability, and swap the image asset for a licensed final photograph.

## Fidelity

**High-fidelity.** All colours, typography, spacing, radii, and shadows in this bundle are final and should be reproduced pixel-for-pixel. The one thing that is deliberately provisional is the hero photograph (`assets/satay-bg.png`), which was generated to establish tone and composition; the final poster should use a licensed / commissioned photograph that matches the same mood (see _Assets_ below).

## Canvas & Sizing

- **Logical canvas:** `1080 × 1620 px` (2:3 portrait ratio).
- **Print target:** A2 (420 × 594 mm) or A3 (297 × 420 mm) at 300 dpi. All type sizes below scale linearly with the canvas — treat 1080 px as the reference width.
- **Scaling behaviour on web:** the entire `.poster-canvas` is transform-scaled on load and `resize` to fit whatever container size it is placed in, preserving aspect ratio (see `<script>` at the bottom of the HTML). In a real framework, prefer a CSS `aspect-ratio: 2/3` container with `container-type: inline-size` and `cqw` units, or use a resize observer — do not ship the inline script pattern in a component library.

## Screens / Views

There is one screen: the poster itself. Its DOM order (back → front) is:

1. `bg` — full-bleed hero photograph (`<img>`, `object-fit: cover`).
2. `grade` — decorative colour-grade + vignette (radial + linear gradients).
3. `grain` — decorative SVG-noise film grain (`mix-blend-mode: overlay`, `opacity: 0.16`).
4. `ticks` — four L-shaped corner crop marks (26 × 26 px, 2 px stroke, `#ffcf7a`).
5. `bottom-scrim` — bottom gradient scrim (560 px tall) that darkens the lower half of the photo so the dates + footer stay legible.
6. `badge` — floating "Free / Entry / All Ages" burst (absolute, top-right).
7. `composition` — the vertical text column (flex column, padding 72 / 72 / 88).
8. `bottom-bar` — thin bottom row (issue no. · hashtag · presenter).

**Layout container (`.composition`):**

- `position: absolute; inset: 0`
- `display: flex; flex-direction: column`
- `padding: 72px 72px 88px`
- `gap: 18px`
- `text-align: center`
- Elastic spacer (`flex: 1; min-height: 20px`) between the tagline and the dates block pushes the dates + footer to the bottom.

### Component-by-component spec

#### 1. Top strip (`.top-strip`)

Row spanning full content width; left label + right pill.

- Left: `Vol. 07 · Est. 2020` — DM Mono 500, 15 px, `letter-spacing: 0.24em`, uppercase, colour `#f4d8a8`. The dot between "07" and "Est." is an 8 × 8 px `#ff3b1f` circle with a `0 0 12px rgba(255,80,30,0.9)` glow.
- Right: `PENANG · MY` — a rounded pill (`border-radius: 999px`, `border: 1.5px solid #f4d8a8`, padding `8px 14px`), DM Mono 500, 15 px, `letter-spacing: 0.3em`. Prefixed by a 10 × 10 px `#ffb400` amber dot with `0 0 10px rgba(255,180,0,0.85)` glow.

#### 2. Eyebrow (`.eyebrow`)

Centred row: `[64 px rule] A Night-Market Feast · George Town [64 px rule]`

- DM Mono 500, 14 px, `letter-spacing: 0.34em`, uppercase, colour `#ffcf7a`.
- The word "Feast" is highlighted in `#57e0a6` (jade).
- Horizontal rules: 64 × 1 px, `#ffcf7a` at 0.7 opacity.
- `gap: 18px` between rule and text; `white-space: nowrap`.

#### 3. Title (`.title`) — three-line stacked wordmark

Font: **Anton**, uppercase, `line-height: 0.86`, `letter-spacing: -0.005em`, `text-shadow: 0 2px 0 rgba(0,0,0,0.4), 0 18px 60px rgba(0,0,0,0.55)`.

- Line 1 — `PENANG`: 196 px, colour `#ffe6b8`.
- Line 2 — `STREET`: **260 px**, fill is a vertical gradient `linear-gradient(180deg, #ffd267 0%, #ff6a1a 55%, #ff2a0a 100%)` clipped to text via `background-clip: text`. `filter: drop-shadow(0 4px 0 rgba(120,20,0,0.35)) drop-shadow(0 24px 40px rgba(255,80,20,0.25))`.
- Line 3 — `FEAST'27`:
  - `FEAST` at 196 px, colour `#f7e7cf`.
  - `'27` (`.amp`) inline, 150 px, jade `#57e0a6`, `transform: translateY(-14px) rotate(-6deg)`, `margin: 0 4px 0 8px`.

#### 4. Tagline (`.tagline`)

Single centred paragraph, max-width 640 px, Archivo 600, 22 px, `line-height: 1.4`, `letter-spacing: 0.01em`, colour `#f4d8a8`. Copy: _"Two smoky nights of hawker legends, wok-fire showdowns and_ **char kway teow** _at sundown. Bring an appetite — leave with a food coma."_ The phrase `char kway teow` uses `<em>` (rendered upright): Archivo 800, colour `#57e0a6`.

#### 5. Free-entry burst badge (`.badge`) — absolute

- Position: `top: 92px; right: 76px` (relative to the 1080 × 1620 canvas).
- 168 × 168 px circle.
- Fill: `radial-gradient(circle at 35% 30%, #ffdd66 0%, #ff6a1a 55%, #c1240a 100%)`.
- Shadow: `inset 0 -6px 20px rgba(80,10,0,0.4), 0 12px 40px rgba(255,80,20,0.45)`.
- Rotated `-10deg`.
- Three stacked lines, centred, colour `#1a0705`:
  - `FREE` — Anton, 22 px, `letter-spacing: 0.08em`.
  - `ENTRY` — Anton, 46 px, `margin: 2px 0 -2px`.
  - `ALL AGES` — DM Mono 500, 15 px, `letter-spacing: 0.2em`.
- `z-index: 5` so it sits above the composition.

#### 6. Dates block (`.dates`)

Three-column grid `1fr auto 1fr`, `align-items: end`, `gap: 24px`, `padding: 28px 8px 22px`, hairline rules top and bottom: `1.5px solid rgba(244,216,168,0.45)`.

- **Left column** (Monday 9 August):
  - `MONDAY` — DM Mono 500, 15 px, `letter-spacing: 0.32em`, uppercase, `#ffcf7a`.
  - `09` — Anton, 148 px, `line-height: 0.85`, `letter-spacing: -0.01em`, `#fff2df`.
  - `AUGUST` — Archivo 900, 22 px, `letter-spacing: 0.24em`, uppercase, `#57e0a6`.
- **Centre separator** — an arrow glyph `→`, Anton 96 px, `#ff6a1a`, `text-shadow: 0 0 24px rgba(255,80,20,0.5)`, `padding-bottom: 18px`.
- **Right column** (Tuesday 10, 2027): same structure as left, `text-align: right`, `align-items: flex-end`.

#### 7. Footer meta (`.footer`)

Three-column grid `1fr 1fr 1fr`, `gap: 24px`, `margin-top: 22px`. Left column left-aligned, centre column centred, right column right-aligned.

Each column has:

- A key (`.k`) — DM Mono 500, 12 px, `letter-spacing: 0.32em`, uppercase, `#ffcf7a`, `margin-bottom: 8px`.
- A value (`.v`) — Archivo 800, 20 px, `line-height: 1.2`, uppercase, `letter-spacing: 0.02em`, `#f7e7cf`.

Content:

| Column                 | Key     | Value                            |
| ---------------------- | ------- | -------------------------------- |
| Left                   | Venue   | `Lebuh Chulia` / `George Town`   |
| Centre                 | Hours   | `6 PM → Late`                    |
| Right (jade `#57e0a6`) | Tickets | `Free · RSVP` / `penangfeast.my` |

#### 8. Bottom bar (`.bottom-bar`)

Absolute row pinned to `bottom: 0`, padding `18px 72px`, DM Mono 500, 12 px, `letter-spacing: 0.3em`, uppercase, `rgba(244,216,168,0.7)`, three items justified: `№ 07 / 27` · `#PenangStreetFeast` · `Presented by Makan Kaki`.

#### 9. Corner ticks (`.tick`)

Four 26 × 26 px L-shapes at each canvas corner, inset 30 px from the edges, 2 px stroke `#ffcf7a`. Purely decorative crop-mark motif.

## Interactions & Behavior

The poster is a **static composition**. No hover, click, animation, or state — everything is render-time visual. If a web implementation adds subtle scroll-in or reveal animation, keep it under 400 ms and confined to opacity + a few px of translate; do not disturb the title stack.

The scaling script in the HTML is a preview-only helper. In a real component, replace it with `aspect-ratio: 2/3` + container queries, or expose the canvas at fixed pixel dimensions in a scrollable frame.

## State Management

None. The poster is content-only. If any field becomes CMS-driven (dates, venue, ticket URL), model it as a flat object; do not introduce state.

## Design Tokens

### Colours

| Token | Hex | Use |
| --- | --- | --- |
| `--bg-deep` | `#0a0605` | Page background outside the canvas |
| `--bg-canvas` | `#120806` | Canvas base colour behind the image |
| `--cream` | `#f7e7cf` | Primary body text on dark |
| `--cream-warm` | `#fff2df` | Title lines 1 & 3 highlight |
| `--sand-1` | `#f4d8a8` | Top-strip labels, tagline body |
| `--sand-2` | `#ffcf7a` | Eyebrow, keys, corner ticks |
| `--title-cream` | `#ffe6b8` | Title line 1 (`PENANG`) |
| `--ember-yellow` | `#ffd267` | Title line 2 gradient stop (top) |
| `--ember-orange` | `#ff6a1a` | Title line 2 gradient mid / arrow / badge gradient mid |
| `--ember-red` | `#ff2a0a` | Title line 2 gradient stop (bottom) |
| `--ember-glow` | `#ff3b1f` | Top-strip dot |
| `--amber` | `#ffb400` | Location-pill dot |
| `--badge-yellow` | `#ffdd66` | Badge radial-gradient stop (top) |
| `--badge-red` | `#c1240a` | Badge radial-gradient stop (bottom) |
| `--badge-ink` | `#1a0705` | Badge text |
| `--jade` | `#57e0a6` | Accent: "Feast" eyebrow, "'27", "char kway teow", month labels, "Free · RSVP" |
| `--shadow-warm` | `rgba(120,20,0,0.35)` | Title `STREET` drop-shadow |

### Typography

Fonts (all served via Google Fonts in the prototype; self-host for production):

- **Anton** — Regular. Used for the title, badge headline, date numerals, and arrow separator.
- **Archivo** — 400 / 600 / 800 / 900. Used for tagline, footer values, month labels.
- **DM Mono** — 400 / 500. Used for the top strip, eyebrow, footer keys, badge subline, and bottom bar.

Type scale (px @ 1080 canvas width):

| Role                  | Family  | Size | Weight | Tracking     | Leading |
| --------------------- | ------- | ---- | ------ | ------------ | ------- |
| Title L1 & L3         | Anton   | 196  | 400    | -0.005em     | 0.86    |
| Title L2 (STREET)     | Anton   | 260  | 400    | -0.005em     | 0.86    |
| Title accent ('27)    | Anton   | 150  | 400    | -0.005em     | —       |
| Date numerals         | Anton   | 148  | 400    | -0.01em      | 0.85    |
| Arrow separator       | Anton   | 96   | 400    | —            | 1.0     |
| Badge "Entry"         | Anton   | 46   | 400    | —            | 0.95    |
| Tagline               | Archivo | 22   | 600    | 0.01em       | 1.4     |
| Tagline emphasis      | Archivo | 22   | 800    | 0.01em       | 1.4     |
| Footer value          | Archivo | 20   | 800    | 0.02em       | 1.2     |
| Month label           | Archivo | 22   | 900    | 0.24em       | —       |
| Badge "Free"          | Anton   | 22   | 400    | 0.08em       | —       |
| Top-strip / mark pill | DM Mono | 15   | 500    | 0.24 – 0.3em | —       |
| Eyebrow               | DM Mono | 14   | 500    | 0.34em       | —       |
| Date DOW              | DM Mono | 15   | 500    | 0.32em       | —       |
| Badge "All Ages"      | DM Mono | 15   | 500    | 0.2em        | —       |
| Footer key            | DM Mono | 12   | 500    | 0.32em       | —       |
| Bottom bar            | DM Mono | 12   | 500    | 0.3em        | —       |

### Spacing

- Canvas padding: `72px 72px 88px`.
- Composition `gap`: `18px` between top-strip / eyebrow / title / tagline groups.
- Corner-tick inset: `30px`.
- Badge offset: `top: 92px; right: 76px`.
- Dates block: `padding: 28px 8px 22px`; hairline rules 1.5 px.
- Footer top margin: `22px`.

### Radii, borders, shadows

- Pill radius: `999px` (top-strip location pill).
- Badge: perfect circle.
- Corner ticks: 2 px `#ffcf7a` on two sides only.
- Title text shadow: `0 2px 0 rgba(0,0,0,0.4), 0 18px 60px rgba(0,0,0,0.55)`.
- STREET filter: `drop-shadow(0 4px 0 rgba(120,20,0,0.35)) drop-shadow(0 24px 40px rgba(255,80,20,0.25))`.
- Badge shadow: `inset 0 -6px 20px rgba(80,10,0,0.4), 0 12px 40px rgba(255,80,20,0.45)`.
- Grill dot glow: `0 0 12px rgba(255,80,30,0.9)`.

### Decorative layers

- **Colour grade / vignette (`.grade`)** — stacked gradients:
  - `radial-gradient(120% 80% at 50% 8%, rgba(10,4,3,0.92) 0%, rgba(10,4,3,0.55) 34%, rgba(10,4,3,0.05) 62%, rgba(10,4,3,0) 100%)`
  - `radial-gradient(140% 90% at 50% 108%, rgba(210,45,10,0.28) 0%, rgba(120,20,5,0.18) 30%, rgba(10,4,3,0) 62%)`
  - `linear-gradient(180deg, rgba(10,4,3,0.15) 0%, rgba(10,4,3,0) 40%, rgba(10,4,3,0) 65%, rgba(10,4,3,0.55) 100%)`
- **Film grain (`.grain`)** — inline SVG `feTurbulence` noise, 240 × 240 tile, opacity 0.16, `mix-blend-mode: overlay`.
- **Bottom scrim (`.bottom-scrim`)** — 560 px tall linear gradient, `rgba(10,4,3,0) → rgba(10,4,3,0.95)`.

All decorative layers set `pointer-events: none` (via the `.decor` class).

## Assets

| File | Path | Origin | Licensing status |
| --- | --- | --- | --- |
| Hero photograph | `assets/satay-bg.png` | AI-generated placeholder (portrait 3:4, ~1024 px wide). Establishes tone but must be replaced. | **Placeholder — not licensed for public distribution.** For the final poster, commission or license a photograph matching the same brief: close-up chicken satay skewers on a smoky charcoal grill, night-market bokeh (red lanterns + jade / blue hawker lights), dark upper half for typography, warm ember glow lower half. |
| Fonts | Google Fonts CDN | Anton, Archivo (400/600/800/900), DM Mono (400/500) | Open Font License — safe for commercial use. Self-host `.woff2` files in production for privacy + performance. |

Icons: none. The `→` in the dates block and inside "6 PM → Late" is a Unicode glyph (`U+2192`), rendered in Anton and Archivo respectively — not an SVG asset.

## Copy (final)

Every string in the poster in one place, for the developer/copy-editor to lift verbatim:

- Top strip: `Vol. 07  ·  Est. 2020` / `PENANG · MY`
- Eyebrow: `A Night-Market Feast · George Town`
- Title: `PENANG` / `STREET` / `FEAST '27`
- Tagline: _Two smoky nights of hawker legends, wok-fire showdowns and **char kway teow** at sundown. Bring an appetite — leave with a food coma._
- Badge: `FREE / ENTRY / ALL AGES`
- Dates: `MONDAY 09 AUGUST` → `TUESDAY 10 2027`
- Footer: `VENUE — Lebuh Chulia / George Town` · `HOURS — 6 PM → Late` · `TICKETS — Free · RSVP / penangfeast.my`
- Bottom bar: `№ 07 / 27` · `#PenangStreetFeast` · `Presented by Makan Kaki`

## Accessibility

- The hero image carries a descriptive `alt` attribute describing the satay grill scene. Preserve it (or update to reflect the final licensed image).
- If used on the web, ensure text remains readable at any container size — the poster is decorative-first; provide an accessible plain-text summary alongside it (event name, dates, venue, ticket URL) rather than relying on OCR of the image.
- Colour contrast between cream text and the darkened top half of the photo is above WCAG AA; the dates block sits on the `bottom-scrim` for the same reason.

## Files in this handoff

- `Penang Street Feast Poster.html` — the full prototype (all styles inline in `<head>`, self-contained apart from the Google Fonts link and the asset below).
- `assets/satay-bg.png` — placeholder hero photograph (to be replaced).
- `README.md` — this document.
