# Content-Ops CRM Platform — Bộ tài liệu thiết kế & triển khai

> Phiên bản 1.0 — 15/08/2026 Nền tảng: CRM Dashboard + AI Landing Page Studio + Checkout/Payment Automation Đối tượng đọc: Founder/Tech Lead (bạn), sau này là dev team

## Cấu trúc bộ tài liệu

| Thư mục | Tài liệu | Nội dung chính |
| --- | --- | --- |
| `product/` | `business-analysis.md` | Tầm nhìn, personas, business model, GTM, định vị |
| `product/` | `functional-requirements.md` | Yêu cầu chức năng chi tiết từng module (FR-xx), user flows, edge cases |
| `architecture/` | `architecture.md` | Kiến trúc tổng thể, monorepo layout, data flow, multi-tenant, portability CF ↔ VPS |
| `architecture/` | `database-schema.md` | Schema Drizzle đầy đủ, index strategy, RLS, migration plan |
| `architecture/` | `tech-stack.md` | Tech stack chi tiết, verified versions, locked decisions (nguồn cho `.claude/rules/tech-stack.md`) |
| `features/` | `studio-builder-spec.md` | Spec chi tiết Landing Studio (canvas, srcmap, layers, comment, edit, zoom/pan) — map với screenshots tham chiếu |
| `features/` | `ai-integration-byok.md` | Kiến trúc AI layer, **phân tích BYOK: kết nối Claude/ChatGPT cá nhân được không (kèm nguồn chính thức)**, import landing từ bên ngoài, Prompt/Skills manager |
| `ops/` | `infra-deployment-cost.md` | Free tier vs VPS Việt Nam (Dokploy), phân tích chi phí, publishing pipeline lên subdomain, migration path |
| `ops/` | `implementation-plan.md` | Kế hoạch thực hiện production-grade theo phase, ước lượng effort, rủi ro, definition of done |
| `runbooks/` | `ai-guide.md` | Cách prompt Claude Code trong repo này để nó tự detect đúng skill/rule/agent cần dùng |

## Tóm tắt quyết định kiến trúc quan trọng (đọc trước)

1. **Landing page xuất bản = HTML tĩnh thuần, zero framework runtime** — serve từ Cloudflare edge (R2 + Worker), đây là cách duy nhất đạt Core Web Vitals gần tuyệt đối cho user non-tech. Dashboard là SPA (Vite + React), không cần SSR.
2. **Studio builder tái sử dụng** — `@dv/core` (srcmap engine), `@dv/ai` (patch layer), `@dv/studio` (UI). Nền tảng này chính là "ứng dụng host" đầu tiên.
3. **Kết nối tài khoản Claude/ChatGPT cá nhân của user: KHÔNG khả thi về mặt ToS cho SaaS multi-tenant** (chi tiết + nguồn ở ai-integration-byok.md). Con đường hợp lệ: (a) BYOK API key, (b) platform key + bán credit, (c) đăng ký chương trình "Sign in with Claude / Sign in with ChatGPT" chính thức (discretionary, phải được duyệt, chạy trên usage credits chứ không phải subscription limit).
4. **Backend Hono viết adapter-agnostic** — chạy Cloudflare Workers ở giai đoạn free tier, chạy Bun/Node trên VPS Việt Nam khi scale; jobs layer trừu tượng hoá (QStash driver ↔ BullMQ driver) để migrate không đau.
5. **Khuyến nghị hạ tầng: hybrid vĩnh viễn** — landing serving luôn ở Cloudflare edge (SEO + tốc độ VN + free), backend/DB có thể về VPS VN. Không nên đưa landing serving về VPS.
6. **Không làm "MVP cắt gọt" nhưng vẫn phải làm theo phase** — sản phẩm tốt nhất ≠ làm tất cả cùng lúc; implementation-plan.md chia phase sao cho mỗi phase đều ship được chất lượng production, không phải prototype.
7. **AI provider mặc định v1 = OpenRouter** (không phải Anthropic/OpenAI trực tiếp) — 1 key, có model free/rẻ (DeepSeek) để build/test không tốn tiền; đổi model/provider sau không đổi code (chi tiết ai-integration-byok.md §1.3, §6).
8. **Email giao dịch dùng Resend**; Auth social login gồm cả Google **và Facebook** (Better Auth, chỉ là config, không thêm package).
9. **Trang quản lý Landing Pages** (`/landings`, gallery kiểu Genspark — screenshot #8) đứng **trước** Studio editor, không vào thẳng canvas (chi tiết studio-builder-spec.md §2).
10. **Kéo-thả trong dashboard dùng 1 lib duy nhất: dnd-kit** (kanban CRM, layer reorder) — không mỗi chỗ 1 lib khác nhau.

## Quyết định đã chốt (trước là open question)

- **Domain gửi email Resend**: `mail.donve.vn`, gửi từ `no-reply@mail.donve.vn`; `info@donve.vn` giữ riêng làm hộp thư liên hệ thật, không qua Resend — chi tiết functional-requirements.md FR-I-05/06.
- **Retention `pageVersions`/R2**: giữ vĩnh viễn version đang publish/có nhãn; prune version trung gian sau 90 ngày hoặc khi vượt 50 version/page — chi tiết infra-deployment-cost.md §2, cột `pageVersions.prunedAt` (database-schema.md).
- **Video trong assets**: giữ nguyên file gốc trên R2 ở v1; ngưỡng ~5GB egress-tương-đương/tháng thì chuyển sang **Bunny Stream** (không phải Cloudflare Stream — rẻ hơn cho video nén hợp lý, xem lý do + số liệu ở functional-requirements.md NFR-15).
- **Payment provider**: không giới hạn SePay — mô hình non-custodial áp dụng cho mọi provider tenant tự đăng ký (VNPAY, MoMo, Casso, PayOS...); SePay là driver mặc định v1 vì rẻ/đơn giản nhất cho tài khoản cá nhân — xem business-analysis.md §4.4, functional-requirements.md FR-D-10/15.

## Thuật ngữ dùng xuyên suốt

- **Org / Tenant**: một khách hàng của nền tảng (chủ khoá học, doanh nghiệp) — đơn vị cô lập dữ liệu.
- **Studio**: trình chỉnh sửa landing page (canvas + chat + layers), tương ứng các screenshot tham chiếu.
- **Srcmap**: JSON ánh xạ giữa element trong HTML preview và vị trí trong source (`Penang Street Feast Poster.html.srcmap.json` trong screenshot #2 chính là file này).
- **Deployment**: một phiên bản landing đã publish lên subdomain (immutable, rollback được).
- **Lead**: bản ghi khách hàng tiềm năng sinh ra từ form landing.
- **Skill**: tài liệu markdown hướng dẫn AI (SEO checklist, brand voice, cấu trúc landing...) — inject vào system prompt khi generate.
