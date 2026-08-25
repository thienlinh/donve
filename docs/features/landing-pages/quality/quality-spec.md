# Quality Specification

## 3 tầng — cho trang native

### Tầng 1 — Schema validation

Zod reject ngay nếu content sai shape, thiếu field bắt buộc, hoặc field `sensitive` bị ghi mà không có approval. Không tính điểm — là điều kiện tồn tại, không phải audit run.

### Tầng 2 — Component-level test

Golden screenshot (3 viewport) + a11y automation, chạy 1 lần khi build/sửa component (`component-library/component-library.md` §Quy trình). Mọi trang dùng component ở version đã pass tầng này được đảm bảo pass.

### Tầng 3 — Page-level audit

| Category | Weight | Cách kiểm tra |
| --- | --- | --- |
| Strategy alignment | 15% | LLM Critic: content khớp Strategy Brief (ICP, positioning) |
| Messaging/Copy | 15% | LLM Critic: rõ ràng, cụ thể, differentiation, proof cho từng claim (`evidenceRef`) |
| Page structure | 15% | Rule: đủ section phục vụ 5 purpose, thứ tự khớp conversion sequence |
| SEO | 15% | Rule (`linkedom`): title/meta/canonical/OG/JSON-LD/heading hierarchy — cần tab SEO thật ở Studio để user sửa được finding (`technical/architecture-and-data-model.md` §Publish · Domain · SEO), không chỉ audit mà không có cách fix |
| Performance | 15% | Lighthouse CI trên `renderedArtifacts` |
| Tracking completeness | 10% | So khớp `eventDefinitions` với component đã chọn |
| Token consistency | 5% | Rule: mọi giá trị màu/font trong HTML truy được về đúng token |
| Visual regression | 10% | Diff `renderedArtifacts` với golden screenshot của `componentId@version` |

## Launch threshold

Overall ≥ 90, không còn finding `critical`. SEO ≥ 85, Performance đạt ngưỡng CWV cấu hình, Tracking completeness = 100%.

Engine giữ raw rule-level result — weighted score chỉ là bản tóm tắt.

## Audit cho `custom_import`

Không có Component Library đứng sau → Tầng 1 và Tầng 2 không áp dụng. Chỉ chạy DOM-rule (`linkedom`: heading/alt/meta/OG/canonical/contrast/viewport meta) + Lighthouse CI. Bỏ qua Strategy alignment, Page structure, Token consistency, Visual regression. Badge UI: "audit giới hạn — không có Component Library đứng sau".

## Audit UI

Tab "Quality" trong Studio (`?panel=quality`) — finding click → highlight đúng element id trên canvas. Visual regression diff hiển thị side-by-side.
