# Thứ tự thi công

Trình tự bắt buộc về mặt kỹ thuật (cái sau phụ thuộc cái trước) — không phải danh sách cắt tính năng. Mọi năng lực ở `product/vision.md` thuộc thiết kế cuối.

**08/2026 — không còn khái niệm "MVP"/cắt giảm phạm vi cho bất kỳ mục nào dưới đây.** Rà soát business/UX toàn hệ thống (08/2026) xác nhận nền tảng đã ở mức trưởng thành hơn "MVP" thông thường (bảo mật lead, RBAC đa tổ chức, i18n, versioning/rollback đều production-grade) — quyết định chủ động: mọi hạng mục còn thiếu dưới đây (kể cả những mục trước đây có thể bị coi là "nice-to-have") đều thực hiện đầy đủ, không có bản rút gọn tạm thời.

## Component Library

Tích hợp `json-render` (`@json-render/core` + `@json-render/react`). Thiết kế + code ~27 component qua `defineCatalog`/`defineRegistry`: props schema, variant, design token binding, a11y contract, tracking contract, golden screenshot baseline.

Điều kiện xong: mỗi component render đúng 3 breakpoint, pass a11y automation, có golden screenshot, SSR ra HTML tĩnh đúng qua `react-dom/server`.

## Publish-time SSR renderer

`packages/studio-render`: `PageSpec` + catalog → HTML/CSS string, chạy trong job Bun/Node, không chạy trên request path.

Điều kiện xong: 1 `PageSpec` viết tay SSR ra HTML tĩnh đúng, publish qua pipeline R2/KV, phục vụ đúng ở edge.

## Studio UI + luồng tạo trang

Canvas thật dùng **Puck** (`@puckeditor/core`, qua `puck-adapter.ts` — quyết định chính thức, xem `README.md` §Cập nhật kiến trúc; không phải `@json-render/react` như câu gốc dưới đây từng viết, giữ nguyên phần còn lại). Route `/landings/new` với 3 nhánh (AI/thủ công/import) theo `technical/ui-ux-design.md` — **việc cần làm ngay**: sửa `landings-page.tsx` để đúng 3 nhánh ngang hàng, bỏ ô prompt-bar một-lượt trỏ thẳng Studio cũ (xem `README.md` §"Việc cần làm"). Inspector là typed prop editor. Panel "Add section" từ Component Library.

Điều kiện xong: user tạo 1 trang hoàn chỉnh, chất lượng cao, hoàn toàn không cần AI — chỉ bằng chọn component + điền nội dung tay + Inspector.

## In-canvas AI chat cho Studio mới

Đóng khoảng trống: Studio mới (native) chưa có chat AI trực tiếp như Studio cũ. Thiết kế đầy đủ ở `ai/agent-pipeline.md` §In-canvas chat: vocabulary patch riêng cho `PageSpec` (`SpecPatchOp` — `setProps`/`insertElement`/`removeElement`/`moveElement`), tool `apply_page_patch`, tái dùng hạ tầng chat/BYOK đã có ở Studio cũ, UI dựng từ `packages/ui/ai-elements` (không dùng Puck AI cloud — vi phạm BYOK).

Điều kiện xong: user gõ lệnh tự nhiên trong tab AI của Studio mới, thấy patch áp trực tiếp lên canvas Puck (undo được), lịch sử chat lưu lại đúng như Studio cũ.

## Media/Asset — upload ảnh/video dùng chung

Thiết kế đầy đủ ở `technical/architecture-and-data-model.md` §Media/Asset. `Dropzone` dùng chung (tách từ `design-files-panel.tsx`), `imageField` cho Puck Inspector, component `media` (ảnh/video đơn + YouTube/Vimeo embed) và `countdown_timer` mới vào catalog, bảng lưu org logo/campaign OG image.

Điều kiện xong: mọi nơi cần ảnh (Studio, org logo, campaign OG image) dùng chung 1 primitive upload; component `media`/`countdown_timer` dùng được trong Page Architect và Add-section thủ công.

## Publish · Domain · SEO — hoàn thiện

Thiết kế đầy đủ ở `technical/architecture-and-data-model.md` §Publish · Domain · SEO: tab SEO thật (title/description/OG image/noindex) ở cả 2 Studio, bước Preview riêng tư trước khi go-live.

Điều kiện xong: user tự đổi được meta title/OG image/noindex trước khi publish, thấy preview card Facebook/Zalo đúng thật trong Studio; publish có bước xem trước bắt buộc trước khi đổi hostname pointer.

## A/B testing (traffic-split)

Thiết kế đầy đủ ở `technical/architecture-and-data-model.md` §A/B testing — đổi data model `deployments`/`publish_outbox`/edge-router pointer từ 1-deploy-1-hostname sang nhiều variant có trọng số. Đặt sau khi Publish/SEO đã hoàn thiện — thay đổi kiến trúc lớn, không làm song song.

Điều kiện xong: 2 variant cùng 1 landing page chia traffic theo % cấu hình, visitor cùng 1 người luôn thấy đúng 1 variant, analytics so sánh được CTR/CVR theo variant.

## Business Intelligence + Strategy

`businessProfiles`, `strategyBriefs`, Research Agent, Strategy Agent, form xác nhận/sửa tay.

Điều kiện xong: từ 1 business brief, nhận Strategy Brief có cấu trúc, sửa tay được, fact/inference/unknown tách rõ.

## Page Architect + Content Agent

Page Architect chọn component có lý do từ Strategy Brief. Content Agent điền content song song per-element.

Điều kiện xong: từ Strategy Brief đã confirm, AI tạo 1 trang hoàn chỉnh qua đúng Component Library.

## Quality System 3 tầng

Tầng 1 có sẵn từ bước Component Library/Renderer. Tầng 2: test harness CI cho Component Library. Tầng 3: page-level audit (rule engine + Lighthouse CI + LLM Critic).

Điều kiện xong: mọi trang có điểm audit minh bạch, publish bị chặn đúng khi còn finding critical.

## Self-critique loop

Auto Fixer nối vào findings, retry đúng phạm vi (content/structure/token). Guardrail `sensitive` field enforce ở tầng type.

Điều kiện xong: 1 trang AI tạo tự động giảm finding critical về 0 qua tối đa N vòng lặp không cần thao tác tay.

## Tracking & Attribution

`trackingPlans`, `eventDefinitions` deterministic, identity/attribution layer, offline conversion loop.

Điều kiện xong: đường đủ `page_view → cta_click → form_submit → lead_created` hoạt động end-to-end, đối chiếu đúng registry.

## Optimization Loop

Optimization Agent đọc analytics + audit history, đề xuất hypothesis, cần approval, không tự publish.

Điều kiện xong: AI đề xuất ít nhất 1 hypothesis có căn cứ dữ liệu thật từ 1 trang đã có traffic.

## Custom Import

`packages/studio-import`: upload zip/file/paste-HTML/URL → sanitize → asset rewrite → detect-form/tracking wizard. Chạy song song, không phụ thuộc AI pipeline — chỉ phụ thuộc DOM-rule audit (dùng chung `linkedom`/Lighthouse) và pipeline publish.

Điều kiện xong: user upload 1 folder HTML+asset, tích hợp lead-form + tracking qua wizard, publish qua đúng pipeline chung, audit DOM-rule chạy được.

## Migration dữ liệu cũ

Landing page tạo trước bản thiết kế này tự động coi là `custom_import` (`customPageBundles` tạo tự động, không cần re-upload) — hưởng ngay bước Custom Import, tuỳ chọn convert sang native sau. Không downtime.

## Dashboard — Campaigns lên ngang mức Leads

Không phải phạm vi kỹ thuật của landing-pages engine, nhưng cùng đợt hoàn thiện 08/2026: trang Campaigns (`apps/dashboard/src/features/campaigns`) thiếu so với trang Leads đã có — nhân bản, search, bulk action, biểu đồ nguồn traffic (dữ liệu UTM đã chảy vào hệ thống, chỉ chưa lên chart). Tái dùng nguyên `QueryState`/table/bulk-toolbar pattern đã chứng minh hoạt động tốt ở Leads — không thiết kế UI mới.

Điều kiện xong: Campaigns có đủ tính năng tương đương Leads (trừ những gì không áp dụng, vd kanban theo stage).

## Kỷ luật

Mỗi bước xong mới sang bước sau — không làm song song Strategy/Content trước khi Component Library + Studio UI đạt điều kiện xong. Verify bằng trang thật sau mỗi bước, không phải "code compile là xong".
