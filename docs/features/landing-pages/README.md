# Landing Pages Platform

Nền tảng tạo, chỉnh sửa, đo lường và tối ưu landing page. AI và thao tác thủ công là hai con đường bình đẳng lên cùng một hệ thống.

## Kiến trúc trung tâm

`PageSpec` (component-typed, không phải HTML tự do) là canonical. Mỗi section là 1 element trong `PageSpec.elements` (flat map theo id), trỏ vào 1 component trong Component Library — props theo Zod schema, variant hữu hạn, design-token binding, tracking contract cố định theo loại component.

Engine catalog/render/patch dùng [`vercel-labs/json-render`](https://github.com/vercel-labs/json-render): `defineCatalog()` định nghĩa component và tự sinh system prompt cho AI; patch là JSON Patch chuẩn (RFC 6902); `@json-render/react` là renderer publish-time (SSR tĩnh, `packages/studio-render`).

**Cập nhật kiến trúc (08/2026) — canvas editor dùng Puck, không dùng `@json-render/react` làm canvas:** bản build thật của Studio (`packages/studio-catalog` + `apps/dashboard/src/features/studio-native`) dùng [`@puckeditor/core`](https://puckeditor.com) làm canvas, với `pageSpecToPuckData`/`puckDataToPageSpec` (`packages/studio-catalog/src/puck-adapter.ts`) chuyển đổi 2 chiều — `PageSpec` vẫn là canonical/DB-persisted, Puck chỉ là view. Đây là quyết định giữ nguyên (không rewrite về `@json-render/react` như bản thiết kế gốc), vì Puck đã hoạt động ổn định qua adapter và việc quay lại tốn công không tương xứng lợi ích. `@json-render/react` tiếp tục là renderer publish-time (SSR tĩnh) — không đổi.

Renderer publish-time chạy ở thời điểm lưu version/publish (build-time, `react-dom/server`), không chạy ở thời điểm phục vụ request. Output là HTML/CSS tĩnh, upload R2, phục vụ qua CF Worker (KV hostname routing + Cache API) — zero compute trên request path, visitor không tải runtime React/json-render/Puck.

AI không thiết kế layout. AI chọn component, điền content theo schema, tinh chỉnh design token. AI cũng có thể **chỉnh sửa trực tiếp trong canvas** qua chat (xem `ai/agent-pipeline.md` §In-canvas chat) — vẫn chỉ thao tác trên component/props đã có trong Component Library, không tự sinh component/layout mới (không dùng "design mode" kiểu Puck AI — xem lý do ở `ai/agent-pipeline.md`).

## Ba con đường tạo trang

1. **AI** — business brief → Business Profile → Strategy Brief → Page Architecture → Content Agent điền theo schema.
2. **Thủ công** — Component Library qua Studio canvas + panel "Add section", không cần AI.
3. **Import** — folder HTML/asset tự tạo hoặc từ công cụ khác (v0, Lovable, ChatGPT, code tay) — nền tảng lo hosting + tracking + lead-form wiring + domain, không ép vào Component Library.

Cả 3 publish qua cùng 1 pipeline (sanitize → minify → hash asset → R2 → outbox → KV → cache warm).

**Việc cần làm — `/landings` hiện chưa khớp đúng 3 con đường này:** màn hình tạo trang hiện tại (`apps/dashboard/src/features/studio/components/landings-page.tsx`) có **4** lối vào — 1 ô prompt AI một-lượt dẫn thẳng vào Studio cũ (HTML/srcmap tự do), 1 nút "AI wizard" dẫn vào pipeline business→strategy→architecture (native), 1 nút "Thủ công" (native), và Import. Ô prompt-bar một-lượt là tàn dư trước khi có wizard — nó tạo ra 1 con đường thứ 4 không có trong bản thiết kế này, dẫn vào 1 mô hình dữ liệu (HTML/srcmap) không liên thông với 2 con đường native còn lại. Cần gộp: bỏ ô prompt-bar một-lượt trỏ vào Studio cũ, để đúng 3 thẻ ngang hàng như `technical/ui-ux-design.md` §"Chọn chế độ tạo — `/landings/new`" đã đặc tả (AI wizard / Thủ công / Import — cùng kích thước, không thẻ nào có badge "Recommended"). Studio cũ (HTML/srcmap) không biến mất — landing page tạo trước khi có bản thiết kế này migrate tự động sang `custom_import` theo đúng cơ chế đã có ở `roadmap/roadmap.md` §"Migration dữ liệu cũ"; không cần một con đường tạo-mới riêng cho nó nữa.

## Sơ đồ

```
BUSINESS PROFILE → STRATEGY BRIEF → PAGE ARCHITECTURE (chọn component)
        │
        ├── CONTENT AGENT (điền field theo schema)          [nhánh AI]
        └── Studio canvas: Add section + Inspector            [nhánh thủ công]
        │
        ▼
   PageSpec (elements map, JSON Patch)
        │
        ▼
   SSR RENDER (build-time) ──── CUSTOM IMPORT (HTML/asset đã sanitize)  [nhánh import]
        │                              │
        ▼                              ▼
   QUALITY AUDIT (3 tầng)      QUALITY AUDIT (DOM-rule only)
        │                              │
        └──────────────┬───────────────┘
                        ▼
                    TRACKING PLAN
                        ▼
                    PUBLISH (R2/KV/outbox)
                        ▼
                    ANALYTICS → OPTIMIZATION
```

## Folder guide

| Folder | Nội dung |
| --- | --- |
| product | vision, ICP, JTBD, năng lực nền tảng |
| strategy | Business Knowledge Graph, Strategy Brief |
| component-library | catalog qua `json-render`, taxonomy component, quy trình thêm/sửa |
| page-system | `PageSpec`, JSON Patch, versioning; chế độ Custom Import |
| ai | agent pipeline, tool boundaries, self-critique loop |
| tracking | identity/attribution/event layer, tracking deterministic |
| quality | scoring model, 3 tầng audit, tầng riêng cho import |
| technical | vị trí trong monorepo, data model, route map, UI/UX design |
| roadmap | thứ tự thi công |

## Thứ tự đọc

README → product/vision → strategy/strategy-brief → component-library/component-library → page-system/page-schema → page-system/custom-import → ai/agent-pipeline → tracking/tracking-and-attribution → quality/quality-spec → technical/architecture-and-data-model → technical/ui-ux-design → roadmap/roadmap.
