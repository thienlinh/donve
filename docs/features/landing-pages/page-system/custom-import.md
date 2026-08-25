# Custom Import

Chế độ tạo trang bằng folder HTML/asset có sẵn — tự thiết kế, xuất từ công cụ khác, hoặc từ AI cá nhân (v0, Lovable, ChatGPT...). Không đi qua Component Library. Vai trò nền tảng: hosting + tracking + lead-form wiring + domain.

## `landingPages.source`

```ts
type LandingPageSource = "native_ai" | "native_manual" | "custom_import";
```

`native_ai` và `native_manual` dùng chung `PageSpec` — khác nhau ở việc ai chọn/điền component.

## Quy trình import

1. **Upload**: zip folder, kéo-thả nhiều file, paste raw HTML, hoặc nhập URL fetch.
2. **Entry point**: chọn 1 HTML làm trang chính nếu có nhiều file.
3. **Sanitize**: `sanitize-html` server-side, allowlist tag/attr, strip script lạ — bắt buộc, không có ngoại lệ.
4. **Asset rewrite**: upload từng file trong `assets/` lên R2 dưới `custom/<landingPageId>/`, rewrite `src`/`href`.
5. **Integrate wizard**:
   - Mọi `<form>` phát hiện → đề nghị kết nối Lead Capture (rewrite `action`/gắn `data-cc-lead-form` để `landing-runtime` intercept submit).
   - Đề nghị chèn tracking beacon nếu chưa có.
   - Báo thiếu `<meta viewport>`/`<title>`/meta description — không tự chèn nếu user không xác nhận.
6. **Publish**: qua đúng pipeline chung (R2/KV/outbox).

## `customPageBundles`

```text
id, orgId, landingPageId, r2Prefix, entryHtmlKey,
detectedForms: [{ selector, wired: boolean, leadFormId? }],
trackingInjected: boolean,
sourceKind: "zip" | "files" | "paste_html" | "url_fetch",
importedAt, lastReuploadedAt
```

## Editing

Không có canvas visual editor cho custom import.

- **Re-upload** — version mới, giữ lịch sử `pageVersions`, rollback được.
- **Comment mode + AI chat**: user chat "sửa headline thành X" → AI đề xuất diff text-based trên HTML gốc → hiển thị diff → approve → version mới.
- **Convert sang native** (1 chiều): AI phân loại từng section thô thành component gần nhất trong catalog; phần không khớp giữ dưới dạng `raw_html_block` (pseudo-component, `props: { html: string }`, không content schema kiểu). Sau convert, trang có canvas editor đầy đủ.

## Quality Audit

Chỉ DOM-rule audit (`linkedom`): heading hierarchy, alt text, meta/OG/canonical, contrast cơ bản, viewport meta, Lighthouse CI performance. Không có: strategy alignment, structure purpose-check, visual regression, token consistency. Badge UI: "Custom import — audit giới hạn cấp DOM".

## Tracking

Beacon auto-wire cho `page_view`/`form_submit` (từ bước Integrate). Event khác cần user tự thêm `data-cc-track="event_name"` — không có AI suy luận tracking tự động cho HTML tự do.
