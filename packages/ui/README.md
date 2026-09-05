# DonVe Design System — Theme v1

Theme tokens for the DonVe platform.

## Design language

DonVe is a SaaS / operations / automation / AI platform. Color semantics are intentionally separated — orange is the brand DNA, not the color for every component.

| Token | Meaning | Use for |
| --- | --- | --- |
| `brand` / `primary` | DonVe identity, primary product actions | Tạo đơn, Chốt đơn, Tạo vận đơn, Lưu thay đổi, Bật automation |
| `ai` | AI, copilot, generation, AI Elements | AI Assistant, Generate, Suggest, AI workflow, Copilot |
| `integration` | Social channels, APIs, connected platforms | Facebook, Instagram, TikTok, Shopee, Lazada, Zalo, Webhooks, APIs |
| `automation` | Workflow, automation, system success | Workflow, Rules, Triggers, automated tasks |
| `success` | Successful operational state | — |
| `warning` | Attention / warning | — |
| `destructive` | Error / destructive action | — |

**Important:** don't make the whole UI orange. Keep most surfaces neutral and use orange for focus and action — this keeps a dense operational app usable while the DonVe identity stays strong.

## Files

- `globals.css` — complete Tailwind v4 + shadcn theme (`@theme inline`, `:root`, `.dark`, base sections).

## Installation

Replace your application's global stylesheet with `globals.css`, or copy its `@theme inline`, `:root`, `.dark`, and base sections into your existing global CSS.

```bash
bun add tailwindcss shadcn
```

Assumes the shadcn/Tailwind setup:

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";
```

## Theme switching

Standard shadcn pattern — the theme switches automatically via `.dark` on `<html>`.

## Usage

```tsx
<Button>Tạo đơn hàng</Button>                                          {/* primary */}
<div className="bg-ai-soft text-ai">AI Assistant</div>                 {/* ai */}
<div className="bg-integration-soft text-integration">Kết nối nền tảng</div> {/* integration */}
<div className="bg-automation-soft text-automation">Automation</div>   {/* automation */}
<div className="shadow-[0_0_40px_var(--brand-glow)]" />                {/* brand glow */}
```

## Avoid

```text
orange for AI
orange for every badge / icon / chart
orange sidebar background
orange borders everywhere
```

## Dark mode

Dark mode intentionally uses warm near-black surfaces rather than pure neutral black, so the orange brand feels integrated with the product instead of pasted onto a generic dark theme.
