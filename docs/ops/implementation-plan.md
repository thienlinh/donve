# 08 — Kế hoạch thực hiện (production-grade, theo phase)

Giả định: bạn là dev chính (senior, có kinh nghiệm checkout VietQR/SePay), làm ~25–30h/tuần cho dự án. Con số là ước lượng thực tế, không lạc quan hoá. "Không làm MVP" được hiểu đúng là: **mỗi phase ship chất lượng production (test, bảo mật, UX hoàn chỉnh cho phần đã làm)** — chứ không phải làm tất cả song song rồi ra mắt một lần (rủi ro cao nhất có thể).

## Phase 0 — Nền móng (1.5–2 tuần)

- Monorepo Turborepo + tsgo + Oxlint/Oxfmt + CI (lint/typecheck/test/build, remote cache).
- `packages/contracts`, `packages/db` (schema database-schema.md + migrate + seed), `packages/auth` (Better Auth + organization + RBAC middleware), `packages/drivers` (interfaces + impl CF).
- `apps/api` skeleton Hono (2 entrypoints), error handling chuẩn, logging, rate limit.
- `apps/dashboard` skeleton: TanStack Router, layout, auth flow, org switcher, i18n scaffold (vi).
- **DoD:** đăng ký → tạo org → mời member → phân quyền hoạt động; cross-tenant test suite xanh; deploy staging tự động.

## Phase 1 — Studio core (3–4 tuần, viết mới hoàn toàn — xem đính chính ở trên)

- Implement `packages/studio-core`/`studio-ui`/`studio-ai` từ đầu theo `docs/features/studio/builder-spec.md`; wiring vào dashboard (feature module L2).
- Canvas iframe + zoom/pan touchpad & chuột (FR-B-05..07), hover/select overlay + label (B-08/09), LayerTree (B-16..17), Edit inspector + inline text (B-10/11), Undo/redo hợp nhất (B-15).
- Design Files tab, assets upload (R2), version history + restore, thumbnail client-side.
- **DoD:** mở 1 file HTML seed, chỉnh manual đầy đủ như screenshots #1/#3/#4/#6, version/restore chạy; keyboard map hoạt động.

## Phase 2 — AI layer (2.5–3 tuần)

- `packages/ai-gateway`: Anthropic + OpenAI qua AI SDK v6, key vault, usage metering.
- BYOK UI (connect, validate, chọn model) — FR-H-01.
- Chat UI (AI Elements): streaming, đính ảnh, suggestion chips.
- Prompt compiler + tool `apply_patch` end-to-end (server validate → version → client optimistic patch).
- Comment mode + queue + Send to Chat (B-12/13); Skills/Prompt manager CRUD + 4 platform skills đầu tiên (bạn viết nội dung).
- **DoD:** prompt → landing hoàn chỉnh có srcmap + layer đặt tên; comment 1 element → AI sửa đúng element; đổi model/provider giữa chừng OK.

## Phase 3 — Publishing (1.5–2 tuần)

- `apps/edge-router` (KV+R2+Cache, beacon), build pipeline SEO/CWV (infra-deployment-cost.md §5), `landing-runtime` v1 (chưa cần payment — chỉ form + popup đăng ký).
- Publish/rollback/unpublish UI; wildcard subdomain; Lighthouse CI.
- **DoD:** publish < 30s, Lighthouse ≥ 95 mobile trên landing mẫu, rollback tức thời.

## Phase 4 — Campaign/Product/Course + CRM (2.5–3 tuần)

- CRUD products/courses/campaigns + formConfig/paymentConfig UI (dropdown "Bạn đang là ai?" như screenshot #7).
- `POST /public/leads` + Turnstile + dedupe; leads list/filter/search, kanban pipeline, lead detail + activities, assignment round-robin, quyền sales.
- Analytics cơ bản (views/submits/conversion per campaign).
- **DoD:** flow landing → form → lead xuất hiện realtime trong CRM → sales thao tác đầy đủ.

## Phase 5 — Payment & fulfillment (2.5 tuần) _(tái dùng kinh nghiệm checkout đã build)_

- Org tự kết nối tài khoản SePay của họ (`paymentConnections`, non-custodial) + trang hướng dẫn; orders + mã đơn (checksum) + VietQR render trong popup; SePay webhook (idempotent, match checksum 2 bước — không phải fuzzy chịu lỗi chung chung, không có ngưỡng dung sai amount, unmatched queue có lý do); nút "Tôi đã chuyển khoản" + popup Zalo; poll status; sales confirm + fulfilled; đối soát UI; flow hoàn tiền thủ công + double-match guard.
- `landing-runtime` v2 hoàn chỉnh (QR, poll, popup chuỗi).
- **DoD:** chuyển khoản thật 10k đồng → popup "thanh toán thành công" tự bật ≤ 30s; kịch bản manual đủ; webhook replay không tạo double-paid.
- _Mốc này = có thể chạy khoá học thật của chính bạn trên nền tảng (dogfood + GTM)._

## Phase 6 — Import, Draw, hoàn thiện (2–3 tuần)

- Import pipeline (B-30/31) + wizard chuẩn hoá phễu; Draw mode + composite screenshot; custom domain (CF for SaaS); audit log UI; export CSV; email notify; polish UX non-tech (mode đơn giản mặc định, onboarding checklist, empty states tiếng Việt tử tế).
- Hardening: pentest checklist tự chạy (OWASP top 10 áp threat model architecture.md §7), load test webhook + public endpoints.
- **DoD:** học viên thật import HTML từ Claude.ai và publish không cần bạn hỗ trợ.

## Phase 7 — VPS & scale (1 tuần, khi chạm ngưỡng infra-deployment-cost.md §2)

- Dokploy stack, migration runbook, BullMQ + Playwright thumbnail/screenshot server-side, monitoring Grafana.

**Tổng: ~16.5–19.5 tuần (~4–4.5 tháng) đến hết Phase 6** (Phase 5 +0.5 tuần so với ước lượng ban đầu do thêm flow kết nối tài khoản thanh toán + hoàn tiền, xem chi tiết functional-requirements.md Module D). Đường găng: Phase 2 (AI patch reliability) và Phase 5 (tiền bạc — phải đúng tuyệt đối).

## Thứ tự có chủ đích

Publish (P3) đứng trước CRM (P4) để bạn demo/quay content sớm bằng chính sản phẩm; Payment (P5) tách riêng vì cần độ tập trung cao nhất về tính đúng đắn.

## Rủi ro kỹ thuật & đối sách

| Rủi ro | Xác suất | Đối sách |
| --- | --- | --- |
| AI patch sai/không stable trên trang phức tạp | Cao | Schema chặt + server validate + fallback full-file + eval set 20 trang mẫu chạy regression mỗi khi đổi prompt (test bench FR-F-04 phục vụ chính việc này) |
| Zoom/pan + overlay lệch toạ độ đa trình duyệt | Trung–Cao (không có code cũ để tham khảo cách né lỗi) | Test matrix Safari/Chrome/Firefox + touchpad/chuột ngay từ prompt canvas đầu tiên ở Phase 1, không để cuối phase mới test |
| Khớp sai mã đơn (nhầm sang đơn khác) | Trung | Mã đơn có checksum (phát hiện gõ sai, không âm thầm khớp nhầm) + auto-match **luôn** yêu cầu amount khớp chính xác (không có ngưỡng dung sai) + đúng 1 ứng viên; mơ hồ/double-match → unmatched queue, không bao giờ tự động xử lý (functional-requirements.md FR-D-05) |
| RLS mất hiệu lực do driver serverless Neon (SET LOCAL không chung transaction với query) | Cao nếu xảy ra, phát hiện muộn | Helper `withOrgScope` bắt buộc, test tích hợp thật (không chỉ test tầng app) ngay từ Phase 0 — architecture.md §6.1 |
| Publish/rollback lệch trạng thái giữa KV và Postgres khi job crash giữa chừng | Trung | Outbox pattern + partial unique index + job reconciliation định kỳ — architecture.md §5.2 |
| Workers CPU limit khi sanitize/parse HTML lớn | Trung | Giới hạn size input; việc nặng đẩy qua QStash job; sau về VPS thì hết |
| ToS AI thay đổi tiếp | Trung | Multi-provider từ Phase 2; theo dõi 2 chương trình Sign-in chính thức; review ToS định kỳ mỗi quý (ai-integration-byok.md §1.4) |
| Scope creep (bệnh nghề nghiệp của chính chúng ta) | Cao | Mọi ý tưởng mới → backlog P2, chỉ review sau Phase 6 |

## Việc cần làm ngay tuần này (không phải code)

1. Chốt tên miền nền tảng (ảnh hưởng branding subdomain tenant).
2. Đăng ký developer interest form "Sign in with ChatGPT" và liên hệ Anthropic về chương trình third-party usage credits.
3. Đăng ký SePay + mở tài khoản test webhook.
4. Viết nháp 4 platform skills (SEO, CWV, copywriting, form chuẩn) — đây là moat, và bạn viết nhanh hơn ai hết vì nó chính là giáo trình của bạn.
