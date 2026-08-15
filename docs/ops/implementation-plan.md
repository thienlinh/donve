# 08 — Kế hoạch thực hiện (production-grade, theo phase)

Giả định: bạn là dev chính (senior, đã có dv-studio-kit + kinh nghiệm checkout VietQR/SePay), làm ~25–30h/tuần cho dự án. Con số là ước lượng thực tế, không lạc quan hoá. "Không làm MVP" được hiểu đúng là: **mỗi phase ship chất lượng production (test, bảo mật, UX hoàn chỉnh cho phần đã làm)** — chứ không phải làm tất cả song song rồi ra mắt một lần (rủi ro cao nhất có thể).

## Phase 0 — Nền móng (1.5–2 tuần)
- Monorepo Turborepo + tsgo + Oxlint/Oxfmt + CI (lint/typecheck/test/build, remote cache).
- `packages/contracts`, `packages/db` (schema database-schema.md + migrate + seed), `packages/auth` (Better Auth + organization + RBAC middleware), `packages/drivers` (interfaces + impl CF).
- `apps/api` skeleton Hono (2 entrypoints), error handling chuẩn, logging, rate limit.
- `apps/dashboard` skeleton: TanStack Router, layout, auth flow, org switcher, i18n scaffold (vi).
- **DoD:** đăng ký → tạo org → mời member → phân quyền hoạt động; cross-tenant test suite xanh; deploy staging tự động.

## Phase 1 — Studio core (3–4 tuần) *(giảm mạnh nhờ dv-studio-kit)*
- Port `@dv/core`, `@dv/studio`, `@dv/ai` vào `packages/studio-*`; wiring vào dashboard (feature module L2).
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

## Phase 5 — Payment & fulfillment (2 tuần) *(tái dùng kinh nghiệm checkout đã build)*
- Orders + mã đơn + VietQR render trong popup; SePay webhook (idempotent, fuzzy match, unmatched queue); nút "Tôi đã chuyển khoản" + popup Zalo; poll status; sales confirm + fulfilled; đối soát UI.
- `landing-runtime` v2 hoàn chỉnh (QR, poll, popup chuỗi).
- **DoD:** chuyển khoản thật 10k đồng → popup "thanh toán thành công" tự bật ≤ 30s; kịch bản manual đủ; webhook replay không tạo double-paid.
- *Mốc này = có thể chạy khoá học thật của chính bạn trên nền tảng (dogfood + GTM).* 

## Phase 6 — Import, Draw, hoàn thiện (2–3 tuần)
- Import pipeline (B-30/31) + wizard chuẩn hoá phễu; Draw mode + composite screenshot; custom domain (CF for SaaS); audit log UI; export CSV; email notify; polish UX non-tech (mode đơn giản mặc định, onboarding checklist, empty states tiếng Việt tử tế).
- Hardening: pentest checklist tự chạy (OWASP top 10 áp threat model architecture.md §7), load test webhook + public endpoints.
- **DoD:** học viên thật import HTML từ Claude.ai và publish không cần bạn hỗ trợ.

## Phase 7 — VPS & scale (1 tuần, khi chạm ngưỡng infra-deployment-cost.md §2)
- Dokploy stack, migration runbook, BullMQ + Playwright thumbnail/screenshot server-side, monitoring Grafana.

**Tổng: ~16–19 tuần (~4–4.5 tháng) đến hết Phase 6.** Đường găng: Phase 2 (AI patch reliability) và Phase 5 (tiền bạc — phải đúng tuyệt đối).

## Thứ tự có chủ đích
Publish (P3) đứng trước CRM (P4) để bạn demo/quay content sớm bằng chính sản phẩm; Payment (P5) tách riêng vì cần độ tập trung cao nhất về tính đúng đắn.

## Rủi ro kỹ thuật & đối sách

| Rủi ro | Xác suất | Đối sách |
|---|---|---|
| AI patch sai/không stable trên trang phức tạp | Cao | Schema chặt + server validate + fallback full-file + eval set 20 trang mẫu chạy regression mỗi khi đổi prompt (test bench FR-F-04 phục vụ chính việc này) |
| Zoom/pan + overlay lệch toạ độ đa trình duyệt | Trung | Đã có bài học dv-studio-kit; test matrix Safari/Chrome/Firefox + touchpad/chuột ngay Phase 1 |
| SePay fuzzy match sai đơn | Trung | Ngưỡng match bảo thủ; mơ hồ → unmatched queue cho người xử; không bao giờ auto-match khi 2 đơn cùng amount trong cửa sổ thời gian |
| Workers CPU limit khi sanitize/parse HTML lớn | Trung | Giới hạn size input; việc nặng đẩy qua QStash job; sau về VPS thì hết |
| ToS AI thay đổi tiếp | Trung | Multi-provider từ Phase 2; theo dõi 2 chương trình Sign-in chính thức |
| Scope creep (bệnh nghề nghiệp của chính chúng ta) | Cao | Mọi ý tưởng mới → backlog P2, chỉ review sau Phase 6 |

## Việc cần làm ngay tuần này (không phải code)
1. Chốt tên miền nền tảng (ảnh hưởng branding subdomain tenant).
2. Đăng ký developer interest form "Sign in with ChatGPT" và liên hệ Anthropic về chương trình third-party usage credits.
3. Đăng ký SePay + mở tài khoản test webhook.
4. Viết nháp 4 platform skills (SEO, CWV, copywriting, form chuẩn) — đây là moat, và bạn viết nhanh hơn ai hết vì nó chính là giáo trình của bạn.
