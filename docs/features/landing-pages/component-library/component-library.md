# Component Library

Nền tảng chất lượng của toàn hệ thống. Mọi bug/lỗi generate, mọi finding Quality Audit, mọi hành vi tracking đều bị chặn trần bởi chất lượng của lớp này.

## Engine — `json-render`

Dùng [`vercel-labs/json-render`](https://github.com/vercel-labs/json-render) làm engine catalog/render/patch — không tự viết.

- `defineCatalog()`: định nghĩa component (props Zod schema, actions, mô tả) và tự sinh AI system prompt mô tả catalog — prompt không bao giờ lệch khỏi schema thật.
- `defineRegistry()`: bind implementation React thật cho mỗi `type` trong catalog.
- `PageSpec`: flat map `{ root, elements: Record<id, Element> }` — patch theo id, reorder = đổi mảng `children`.
- Patch: JSON Patch chuẩn (RFC 6902) — `add/remove/replace/move`.
- `SpecStreamCompiler`: áp patch từng chunk khi AI stream — canvas build live.
- `@json-render/react`: renderer cho cả canvas editor (reactive) và SSR publish (tĩnh).

## Hai chế độ render

1. **Studio (editor)**: canvas thật là `@puckeditor/core` (không phải `@json-render/react` — xem `README.md` §Cập nhật kiến trúc), qua `pageSpecToPuckData`/`puckDataToPageSpec` (`packages/studio-catalog/src/puck-adapter.ts`). Hover/select/Inspector là UI React bình thường; `PageSpec` vẫn là canonical/DB-persisted, Puck chỉ là view.
2. **Publish (visitor)**: render server-side qua `react-dom/server` dùng `@json-render/react` làm renderer (build-time SSR, `packages/studio-render`), mọi `$state`/`$computed` resolve thành giá trị cố định, xuất HTML/CSS string thuần. Không ship runtime React/json-render/Puck tới visitor. Tương tác thật (form submit, popup, phone format, Turnstile) do `landing-runtime` (~6KB vanilla) đảm nhiệm qua `data-*` hook mà mỗi component render ra.

## Định nghĩa 1 component

```ts
defineCatalog({
  components: {
    hero: {
      description: "Above-the-fold: headline, subheadline, CTA chính+phụ",
      props: z.object({
        headline: z.string().max(80),
        subheadline: z.string().max(160),
        ctaLabel: z.string(),
        ctaHref: z.string(),
        secondaryCtaLabel: z.string().optional(),
        image: z.object({ src: z.string(), alt: z.string() }),
        variant: z.enum([
          "saas",
          "leadgen",
          "product",
          "ecommerce",
          "personal_brand",
          "event"
        ])
      }),
      actions: ["navigate"]
    }
    // ...
  }
});
```

Field nhạy cảm (giá, guarantee, legal claim) đánh dấu `sensitive` qua metadata schema — patch vào field này bị chặn nếu thiếu `humanApproved`. Chỉ role `org_owner`/`org_admin` được phép set `humanApproved` (đúng role model RBAC hiện có của platform, không phải role riêng cho landing pages).

## Nguyên tắc thiết kế

1. ~27 component gốc, 2-5 variant mỗi cái — không mở rộng catalog tuỳ tiện.
2. Mỗi component tự chịu trách nhiệm 100% responsive (mobile 390 / tablet 768 / desktop 1440), accessibility, tracking contract cố định.
3. Component chỉ nhận content + design token — không tự chọn màu/font/spacing.

## Taxonomy

| Category | Component | Variant | Purpose |
| --- | --- | --- | --- |
| Hero | `hero` | saas, leadgen, product, ecommerce, personal_brand, event | understanding + action |
| Nav | `nav_bar` | simple, mega_menu, sticky_cta | understanding |
| Social proof | `logo_wall` | grid, marquee | proof |
| Social proof | `testimonial` | single_quote, grid, video, case_study | proof |
| Social proof | `metric_proof` | counter_row, stat_cards | proof |
| Problem | `problem_statement` | split_text_image, agitate_list | understanding |
| Solution | `solution_overview` | split, video_demo | understanding |
| Features | `feature_bento` | 2x2, 3x2 | desire |
| Features | `feature_grid` | icon_grid, screenshot_grid | desire |
| Features | `feature_tabs` | horizontal_tabs, vertical_tabs | desire |
| Process | `how_it_works` | numbered_steps, timeline | risk_reduction |
| Pricing | `pricing_table` | 2_tier, 3_tier, single_plan, with_comparison | desire + action |
| Comparison | `comparison_table` | vs_competitor, vs_alternative | desire |
| Objection | `faq_accordion` | single_column, two_column | risk_reduction |
| Trust | `trust_badges` | security, certification, guarantee | risk_reduction |
| Lead capture | `lead_form` | inline_short, inline_progressive, modal_trigger | action |
| CTA | `cta_banner` | centered, split_image | action |
| CTA | `cta_sticky` | bottom_bar, floating_button | action |
| Content | `rich_text_block` | article_style | understanding |
| Content | `gallery` | grid, carousel | desire |
| Content | `media` | image, video_upload, youtube, vimeo | desire + proof |
| Urgency | `countdown_timer` | banner, inline | action |
| Team | `team_grid` | photo_grid, single_founder | proof |
| Footer | `footer` | standard, minimal, with_newsletter | understanding |
| Utility | `divider`, `spacer`, `announcement_bar` | — | — |

**Bổ sung 08/2026** — 2 component còn thiếu so với các landing-page builder cạnh tranh (Unbounce/Landingi): `media` (ảnh/video đơn lẻ — trước đây video chỉ lồng được trong `testimonial`/`solution_overview`, không có block độc lập) và `countdown_timer` (khan hiếm/urgency — sale, webinar). Xem `technical/architecture-and-data-model.md` §Media/Asset cho thiết kế upload/field đi kèm `media`.

**Puck field cho prop kiểu ảnh** — `imagePropsSchema` (`{src, alt}`, dùng trong `hero`/`gallery`/`media`...) hiện render thành 2 ô text thô trong Inspector Puck (`fieldForSchema`'s generic `object` fallback, `packages/studio-catalog/src/puck-config.tsx`) — cần 1 field tuỳ biến `imageField` (cùng khuôn `stringArrayField` đã có) mở `Dropzone` upload thay vì bắt user tự dán URL asset.

## Quy trình thêm/sửa component

1. Thiết kế visual đúng token, đúng 3 breakpoint.
2. Implement React component thật theo `defineRegistry` — props theo Zod schema đã khai trong catalog.
3. Golden screenshot test (3 viewport) qua SSR render — baseline visual regression (`quality/quality-spec.md`).
4. A11y automation (contrast/aria/heading) chạy trên component.
5. Khai `actions`/tracking events trong catalog — Tracking Agent đọc thẳng từ đây.
6. Version hoá `componentId@version` — trang cũ pin version; "Recompile" là hành động chủ động của người dùng.
