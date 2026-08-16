# Prompt playbook — build nền tảng từ đầu đến cuối

> Đi kèm `ai-guide.md` (cách Claude tự detect agent/skill) và `implementation-plan.md`
> (phase, effort, DoD). File này là phần **còn thiếu**: danh sách prompt cụ thể, đúng thứ tự,
> để chạy từng phase mà không phải tự nhớ nêu context gì mỗi lần.

## Trả lời trước: Claude Code có "folder prompts" không?

Không có cơ chế nào tự nạp một `prompts/` tuỳ ý — chỉ có 2 folder Claude Code thực sự đọc:

- **`.claude/agents/*.md`** — định nghĩa agent (đã có, không phải chỗ để chứa prompt xây tính năng).
- **`.claude/commands/*.md`** — mỗi file = 1 **slash command** tái sử dụng (gõ `/ten-file`), có tham số. Đúng chỗ cho prompt bạn sẽ **gõ lại nhiều lần** (vd "thêm product type mới", "thêm skill nền tảng mới").

Danh sách prompt build từ đầu-đến-cuối trong file này **không** phải loại đó — mỗi prompt chỉ chạy **một lần**, theo thứ tự phase, không cần tham số hoá. Biến nó thành slash command là over-engineering (bọc thêm cơ chế cho việc chỉ chạy 1 lần). Vì vậy: giữ nguyên dạng **doc thường trong `docs/`** — đúng convention đang có (`ops/implementation-plan.md` đã là "kế hoạch", file này là "kế hoạch ở mức prompt"), đặt cạnh `ai-guide.md` vì cùng chủ đề "prompt Claude Code trong repo này".

Nếu về sau có việc lặp lại thật (vd cứ mỗi campaign mới lại phải gõ lại một đoạn prompt dài), lúc đó mới tách riêng thành `.claude/commands/`.

## Cách dùng file này

1. Chạy đúng thứ tự phase 0 → 7 (không nhảy cóc — mỗi phase là nền cho phase sau, đúng tinh thần "không MVP cắt gọt" của implementation-plan.md).
2. Copy nguyên văn prompt, dán vào Claude Code. Prompt đã cố ý nêu rõ **quy mô** và **agent kỳ vọng** theo mẹo ở `ai-guide.md` — không cần gõ tên agent thủ công, nhưng có thể ép trực tiếp nếu muốn.
3. Sau mỗi prompt: chạy `bun run lint && bun run typecheck && bun run build` (đã là rule bắt buộc ở `.claude/rules/tech-stack.md`), rồi đối chiếu **DoD** của phase trong implementation-plan.md trước khi sang prompt kế.
4. Mỗi prompt tham chiếu đúng mã `FR-xx` liên quan — nếu Claude lệch khỏi FR đó, trỏ lại functional-requirements.md/studio-builder-spec.md/ai-integration-byok.md trong câu trả lời tiếp theo thay vì diễn giải lại từ đầu.
5. Mỗi prompt là 1 checkbox `- [ ]` — tick `- [x]` sau khi chạy xong và qua DoD, vẫn đọc từ trên xuống dưới theo đúng thứ tự phase. Prompt nào có ghi chú in đậm dạng "— đã có X, còn thiếu Y" nghĩa là **đã làm một phần thật** (không phải placeholder) — đọc kỹ phần "còn thiếu" trước khi chạy lại prompt đó để tránh làm lại từ đầu phần đã xong.

---

## Phase 0 — Nền móng

> **Trạng thái thực tế (kiểm tra trực tiếp trong repo):** mới xong phần **tooling/scaffold** — workspaces, catalogs, `turbo.json`, `.oxlintrc.json`/`.oxfmtrc.json` đều thật và `bun run lint/typecheck/build` chạy sạch; CI cơ bản đã có (`.github/workflows/ci.yml`). **Toàn bộ phần nghiệp vụ (mục 2-8 dưới đây) chưa bắt đầu** — `packages/{contracts,db,auth,drivers}/src/index.ts` và `apps/api/src/*.ts` vẫn là placeholder 2 dòng, `apps/dashboard/src` chỉ có scaffold Vite/shadcn mặc định (chưa router/auth/org switcher), chưa có file test nào. Đừng để checkbox đã tick ở mục 1 làm tưởng cả phase đã xong.

- [x] "Setup monorepo Turborepo + Bun workspaces theo đúng `.claude/rules/tech-stack.md` và `docs/architecture/architecture.md` §3: tạo cấu trúc `apps/`, `packages/` rỗng (chỉ package.json + tsconfig đúng preset), root `turbo.json`, `.oxlintrc.json`, `.oxfmtrc.json`, CI (lint/typecheck/test/build + remote cache). Việc này đụng nhiều package — thiết kế cấu trúc trước khi viết code." **— đã xong phần cấu trúc + CI cơ bản; còn thiếu remote cache (turbo remote caching chưa cấu hình, xem lại khi chạy prompt #9).**
- [x] "Tạo `packages/contracts`: zod schema cho toàn bộ entity ở `docs/architecture/database-schema.md` (org, user, membership, product, campaign, landing, lead, order, payment, ai_connection...). Chỉ schema + types, chưa cần DB thật."
- [x] "Tạo `packages/db`: Drizzle schema đúng `docs/architecture/database-schema.md`, migration, seed script, repository pattern — mọi hàm query bắt buộc nhận `orgId`, không có hàm 'query trần' (NFR-04, architecture.md §6). **Bắt buộc** implement helper `withOrgScope(orgId, fn)` gửi `SET LOCAL app.current_org` + query thật trong cùng transaction/batch (không phải 2 round-trip rời — RLS im lặng mất hiệu lực trên Neon serverless driver nếu tách rời, architecture.md §6.1); viết test tích hợp thật (2 org giả A/B, query chéo qua repository layer phải trả rỗng) — không chỉ test tầng app."
- [ ] "Tạo `packages/auth`: Better Auth + organization plugin + RBAC theo bảng quyền ở `docs/architecture/architecture.md` §6 (owner/admin/editor/sales) — FR-A-01 đến FR-A-04."
- [ ] "Tạo `packages/drivers`: interface `jobs`, `storage`, `cache`, `realtime`, `payments` (chỉ interface, SePay là impl cụ thể đầu tiên — VNPAY/MoMo/Casso/PayOS thêm sau không đổi interface, FR-D-10) (chưa cần impl VPS) + impl Cloudflare (QStash, R2, Upstash, SSE-hub, SePay) — đúng nguyên tắc portable ở architecture.md §1 nguyên tắc #2. Đây là boundary quan trọng nhất cho migration CF↔VPS sau này, thiết kế trước khi code."
- [ ] "Tạo `apps/api` skeleton Hono với 2 entrypoint `workers.ts` (CF) và `bun.ts` (VPS), error handling chuẩn, structured logging JSON (requestId, orgId — architecture.md §8), rate limit middleware."
- [ ] "Tạo `apps/dashboard` skeleton: Vite 8 + React 19 + TanStack Router, layout cơ bản, auth flow (login/signup/verify email), org switcher, code-split theo route/module để đạt TTI < 3s lần đầu và chuyển route < 200ms (NFR-02), i18n scaffold tiếng Việt với kiến trúc message catalog ICU để thêm EN sau (NFR-07). Wiring Resend làm email provider cho Better Auth (verify email FR-A-01, invite FR-A-04, reset mật khẩu FR-I-02) — domain gửi đã chốt `mail.donve.vn`, địa chỉ `no-reply@mail.donve.vn` (FR-I-05/06); verify SPF/DKIM/DMARC trước khi test gửi thật."
- [ ] "Viết cross-tenant test suite: user org A gọi mọi endpoint hiện có với id thuộc org B phải trả 404/403 (NFR-04, architecture.md §6) — viết test cho các endpoint auth/org vừa tạo, cả edge case."
- [ ] "Setup CI/CD theo infra-deployment-cost.md §6: GitHub Actions chạy `turbo run lint typecheck test build` (affected-only qua remote cache), 3 environment `dev` (miniflare/wrangler dev + Neon branch)/`staging` (Neon branch riêng)/`prod`, secrets qua Wrangler secrets tách riêng masterKey mã hoá BYOK (rotate được sau này); deploy staging tự động (CF Pages + Workers) cho `apps/dashboard` + `apps/api`." **— mới có CI cơ bản (install→lint→fmt:check→typecheck→build→test) trong `.github/workflows/ci.yml`; còn thiếu remote cache, 3 environment, Wrangler secrets, auto-deploy staging — chưa tick.**

**Trước khi qua Phase 1**: đối chiếu DoD — đăng ký → tạo org → mời member → phân quyền hoạt động; cross-tenant suite xanh; deploy staging tự động.

---

## Phase 1 — Studio core

> Lưu ý: đây là port code có sẵn (`dv-studio-kit`), không viết mới từ đầu — nói rõ điều này trong prompt để Claude không tự generate lại logic đã có.

- [ ] "Port `@dv/core` vào `packages/studio-core` (srcmap engine, patch ops, undo/redo) — giữ nguyên logic, chỉ đổi package name theo `@dv/<name>` convention và path import. Đây là package độc lập, không biết gì về CRM (architecture.md §1 nguyên tắc #3)."
- [ ] "Port `@dv/studio` vào `packages/studio-ui` (Canvas, LayerTree, Inspector, mode system view/select/edit/comment/draw) tương tự."
- [ ] "Port `@dv/ai` vào `packages/studio-ai` (patch protocol, prompt compiler khung sườn — chưa cần gọi API thật, để Phase 2 AI nối vào)."
- [ ] "Wiring `packages/studio-*` vào `apps/dashboard` như feature module L2 (`features/studio`) theo mô hình 4 lớp L0→L3 ở architecture.md §3."
- [ ] "Implement route `/landings` — **trang đứng trước Studio editor, không vào thẳng canvas** (studio-builder-spec.md §2, FR-B-00): lưới card landing của org (thumbnail, tên, badge Draft/Published, campaign gắn, cập nhật lần cuối) kiểu Genspark (screenshot #8) — thanh 'Bạn muốn tạo landing gì?' (prompt input + chọn design system) phía trên/sidebar, lưới kết quả bên dưới; filter tất cả/theo campaign/Published/Draft + search tên + sort (FR-B-00b); submit prompt → tạo `landingPages` + gọi generate lần đầu (FR-B-21, nối ở Phase 2) → điều hướng `/landings/:id/studio` (FR-B-00c); card actions đổi tên/nhân bản/xoá/xem live (FR-B-00d, P1). Route này là điểm vào chính của dashboard sau login, làm trước khi implement layout Studio bên dưới."
- [ ] "Implement layout tổng thể Studio đúng studio-builder-spec.md §2: TopBar (tên dự án, Share/New/⋯), ChatPanel trái thu gọn/mở rộng (FR-B-01/02), WorkArea phải với tab Design Files / `<Page>.html`, toolbar canvas (`+Tweaks`, `Comment`, `Edit`, `Draw`, zoom indicator) và top bar `Export` (dropdown HTML/ZIP/PNG)/`Present` (fullscreen preview)/`Download`/`Share` (FR-B-03) — `panelSizes`/`chatCollapsed`/`activeTab` persist localStorage per user. Việc này là khung UI toàn bộ studio, thiết kế state/layout trước khi cắm canvas engine vào."
- [ ] "Implement canvas iframe sandboxed load HTML thật (FR-B-04), zoom 10%-400% (touchpad pinch, `Cmd +/-`, nút UI, zoom quanh con trỏ — FR-B-05), pan (space-drag, two-finger scroll, middle-mouse), fit-to-screen mặc định + double-click reset (FR-B-07), canvas mở rộng được qua kéo splitter chat/canvas — nhớ kích thước theo user, persist localStorage (FR-B-06). Test matrix Safari/Chrome/Firefox ngay từ đầu — đây là rủi ro kỹ thuật đã biết (implementation-plan.md bảng rủi ro)."
- [ ] "Implement hover (border nét đứt + label tag dạng `span [cc-2] 'STREET'`) và click-select (border nét liền, đồng bộ highlight LayerTree) — FR-B-08/09, đúng screenshot #4/#6."
- [ ] "Implement Edit mode inspector: properties panel Typography/Size/Box, apply trực tiếp qua srcmap + cập nhật preview tức thì không reload iframe (FR-B-10); inline text edit contenteditable double-click, commit khi Enter/blur (FR-B-11)."
- [ ] "Implement LayerTree panel: liệt kê element có ngữ nghĩa, icon loại, toggle ẩn/hiện, click scroll-into-view, hover highlight (FR-B-16/17); rename layer (FR-B-18, P1); kéo thả đổi thứ tự (FR-B-19, P1)."
- [ ] "Implement Undo/Redo toàn cục cho mọi thay đổi source (manual edit, inline text — AI patch nối ở Phase 2), `Cmd+Z`/`Shift+Cmd+Z`, ≥100 bước trong session (FR-B-15); đầy đủ keyboard map studio-builder-spec.md §9 (V/E/C/D đổi mode, Cmd+S force save, Delete xoá element có confirm khi section lớn, Esc bỏ chọn/đóng modal) — dashboard phải điều hướng được hoàn toàn bằng bàn phím ở studio, focus ring rõ (NFR-08)."
- [ ] "Implement tab Design Files (cây FOLDERS/PAGES/DATA/IMAGES — screenshot #2) đúng cấu trúc project mỗi landing (FR-B-26): `assets/` (ảnh upload/stock), `screenshots/`, `Page.html`, `Page.html.srcmap.json`, `.thumbnail.jpg` tự chụp sau mỗi save; upload ảnh assets (drag-drop, nén + WebP/AVIF — FR-B-29), version history (list, diff, restore, đặt nhãn — FR-B-27)."
- [ ] "Implement Export (FR-B-28): dropdown ở top bar xuất HTML đơn file, ZIP kèm assets, PNG full-page (chụp qua `modern-screenshot` client-side)."
- [ ] "Viết test cho toàn bộ patch ops của studio-core (replaceText, setStyle, setAttr, replaceOuterHTML, insertBefore/After, remove, toggleVisibility, renameLayer) — đảm bảo undo/redo đúng cho từng loại, cả edge case (patch vào element đã bị xoá, patch chồng lấn)."

**DoD Phase 1**: mở 1 file HTML seed, chỉnh manual đầy đủ như screenshot #1/#3/#4/#6, version/restore chạy; keyboard map hoạt động; export HTML/ZIP/PNG ra đúng file.

---

## Phase 2 — AI layer

> Đường găng của cả dự án (implementation-plan.md) — đừng rút gọn test bench, đây là phase quyết định AI patch có tin cậy được không.

- [ ] "Tạo `packages/ai-gateway`: provider abstraction **OpenRouter (mặc định) + Anthropic + OpenAI** qua AI SDK v6, key vault mã hoá AES-256-GCM (NFR-05), usage metering theo token. Đây là boundary bảo mật quan trọng — review kỹ phần lưu/giải mã key."
- [ ] "Implement BYOK UI trong dashboard: connect API key (mặc định gợi ý OpenRouter trước — key duy nhất, có model free để test), validate bằng call thử, chọn model mặc định (FR-H-01); routing trong ai-gateway — nếu `connectionId=platform` thì trừ `aiCreditBalance` **atomic** trong cùng transaction với insert `aiUsage` (`UPDATE ... WHERE ai_credit_balance >= cost`, database-schema.md ghi chú #8 — không check-rồi-trừ 2 bước riêng, race condition khi nhiều request đồng thời), hiển thị usage cho tenant (FR-H-02, gói trả phí); chọn model mạnh cho generate lần đầu, model rẻ (DeepSeek qua OpenRouter/Haiku) cho patch nhỏ/đặt tên layer để tiết kiệm chi phí (ai-integration-byok.md §2, §6). Implement thêm N lần dùng thử (vd 3) không cần BYOK, chạy trên key nền tảng qua Cloudflare Workers AI, không phải Gemini (FR-H-05, ai-integration-byok.md §6) — giảm ma sát onboarding non-tech."
- [ ] "Implement Chat UI bằng AI SDK v6 `useChat` + AI Elements (Conversation, Message, PromptInput, Reasoning): streaming, đính ảnh, suggestion chips (FR-B-20)."
- [ ] "Implement prompt compiler trong `packages/studio-ai`: base prompt + skills đang bật + design tokens + srcmap context + comment queue → system prompt cuối cùng (architecture.md §5.1, FR-B-24)."
- [ ] "Implement tool call `apply_patch` end-to-end theo schema ai-integration-byok.md §4: server validate ops bằng studio-core → áp lên HTML hiện tại → tạo `page_version` mới → trả patch cho client; client áp cùng patch vào DOM iframe optimistic (không reload) + đẩy undo stack (FR-B-22/23). Fallback full-file khi patch validate fail."
- [ ] "Bảo vệ prompt injection: nội dung trang import/AI đọc phải bọc trong delimiter rõ ràng, system prompt chỉ định đó là data không phải lệnh (architecture.md §7) — review lại đoạn xử lý này, đây là input không tin cậy đi thẳng vào AI."
- [ ] "Implement generate lần đầu: prompt → AI sinh HTML single-file inline CSS tuân theo skills đang bật → hiện canvas + tự tạo srcmap + layer tree (FR-B-21). Nguồn ảnh minh hoạ AI chèn: ưu tiên tuyệt đối ảnh tenant đã upload, chỉ dùng Unsplash/Pexels API (license thương mại, ghi `pageAssets.source/license`) khi tenant chưa có ảnh phù hợp, hỏi trước khi tự chèn stock (FR-B-32/33) — không tự sinh ảnh AI ở v1 (FR-B-34)."
- [ ] "Implement Comment mode: click element → modal (textarea, đính ảnh P1) → Queue hoặc Send to Chat; comment gửi = message kèm ngữ cảnh element (srcmap id, ảnh crop, selector), hiển thị chip 'Commented on element' trong chat (FR-B-12); queue có badge đếm + nút 'Send all' gộp 1 request AI (FR-B-13)."
- [ ] "Tạo `packages/db` migration + CRUD cho Skill (FR-F-01) và Prompt template (FR-F-03, biến `{{brand}}`/`{{product}}`/`{{tone}}`, versioning, preview compiled prompt). Viết nội dung 4 skill nền tảng: `seo-landing-vn`, `cwv-budget`, `copywriting-chuyen-doi`, `form-phễu-chuẩn` (đây là moat theo implementation-plan.md — nội dung do bạn viết, Claude chỉ dựng CRUD/UI, không tự bịa nội dung dạy học)."
- [ ] "Test bench prompt (FR-F-04, P1): chạy 1 prompt với model chọn, chạy Lighthouse sandbox trên output, so sánh 2 version — cần cho eval set 20 trang mẫu regression mỗi khi đổi prompt (implementation-plan.md đối sách rủi ro AI patch)."

**DoD Phase 2**: prompt → landing hoàn chỉnh có srcmap + layer đặt tên; comment 1 element → AI sửa đúng element; đổi model/provider giữa chừng OK.

---

## Phase 3 — Publishing

- [ ] "Tạo `apps/edge-router` CF Worker: KV hostname→deployment_id, R2 deployments/<id>/*, Cache API immutable, event beacon `/e/*` (architecture.md §2). Asset tĩnh đặt tên theo content-hash, `Cache-Control: public, max-age=31536000, immutable`; HTML gốc `no-store`/ngắn (xem §5.2 cache invalidation) (NFR-14). Rate limit `/e/*` theo IP + campaign, cộng thêm cache 2s edge đã có (NFR-16)."
- [ ] "Implement build pipeline publish theo **outbox pattern** (architecture.md §5.2 — đã đổi từ KV-put-trực-tiếp): tạo `deployments` status=building → sanitize → minify html/css → hash assets → rewrite URL → inject runtime script defer + meta/OG/JSON-LD + canonical + beacon → upload R2 → tạo `publish_outbox` row status=pending → worker áp KV put → KV xác nhận thành công thì set `deployments.status=live` VÀ `publish_outbox.status=applied` trong cùng bước → warm cache + chụp thumbnail (FR-G-01). Thêm partial unique index `deployments(hostname) WHERE status='live'` (database-schema.md) và job reconciliation định kỳ so KV thật với Postgres."
- [ ] "Tạo `apps/landing-runtime` v1 (vanilla TS ~5-8KB, build IIFE qua tsdown — package compiled duy nhất, đúng ngoại lệ ở `.claude/rules/tech-stack.md`): chỉ form + popup đăng ký, chưa cần payment (FR-D-01 rút gọn cho phase này)."
- [ ] "Implement Publish/Rollback/Unpublish UI trong dashboard: rollback đi qua **cùng cơ chế outbox** ở prompt #2 (tạo outbox row mới trỏ `targetDeployId` về deployment cũ), không phải KV put trực tiếp bỏ qua outbox — tức thời về mặt UX nhưng vẫn nhất quán/audit được (FR-G-01/02, architecture.md §5.2); mỗi deployment gắn snapshot version audit được (FR-G-03). HTML gốc tại hostname set `Cache-Control` ngắn/`no-store` ở Cache API (không cache dài như asset tĩnh) để rollback có hiệu lực ngay không cần purge riêng."
- [ ] "Implement wildcard subdomain (validate trùng + reserved words, FR-G-01) và SEO tự động: sitemap.xml + robots.txt per subdomain, canonical, OG image từ thumbnail, JSON-LD từ product/course gắn campaign (FR-G-05)."
- [ ] "Setup Lighthouse CI trong `tooling/lighthouse-ci` chạy trên mỗi deployment mẫu — gate NFR-01 (Performance/SEO/BestPractices/A11y ≥95 mobile, LCP <1.8s 4G VN, JS runtime ≤10KB gzip)."

**DoD Phase 3**: publish < 30s, Lighthouse ≥ 95 mobile trên landing mẫu, rollback tức thời.

---

## Phase 4 — Campaign/Product/Course + CRM

- [ ] "CRUD Product (FR-C-01: tên, giá, mô tả, ảnh, `type` + JSONB attributes extensible) và Course (FR-C-02: product type=course + link nhóm Zalo, hướng dẫn kích hoạt, lịch khai giảng)."
- [ ] "CRUD Campaign (FR-C-03/04): gắn n product, n landing, thời gian, mục tiêu, UTM mặc định, formConfig (fields bật, dropdown 'Bạn đang là ai?' tuỳ biến — screenshot #7), popupConfig, paymentConfig (VietQR account, template nội dung CK, bật/tắt SePay, link Zalo)."
- [ ] "Implement `POST /public/leads` (FR-D-02/03): nhận field theo `campaign.formConfig` (họ tên, SĐT VN, email optional, persona 'Bạn đang là ai?', custom fields text/select/checkbox), validate SĐT VN, Turnstile invisible, rate limit IP + honeypot, dedupe theo SĐT trong org (FR-E-06). Bắt buộc checkbox consent thu thập dữ liệu cá nhân (mặc định không tick sẵn) ghi vào bảng `consents` (NFR-09, database-schema.md) — đây là yêu cầu tuân thủ Nghị định 13/2023/NĐ-CP, không phải optional."
- [ ] "CRM: danh sách lead (filter campaign/product/trạng thái/UTM/ngày/người phụ trách, full-text search, phân trang server-side — FR-E-01), pipeline kanban kéo thả cấu hình theo org (FR-E-02)."
- [ ] "Chi tiết lead: timeline activities, thông tin đơn + thanh toán, campaign nguồn (FR-E-03); assignment gán tay/round-robin theo campaign, sales chỉ thấy lead được gán nếu cấu hình vậy (FR-E-04); hành động nhanh `tel:`, copy SĐT, mở Zalo, xác nhận thanh toán, đánh dấu fulfilled (FR-E-05)."
- [ ] "Analytics cơ bản campaign: views/submits/conversion rate theo ngày, đọc từ bảng `events` append-only (FR-C-05, architecture.md §8)."
- [ ] "Digest email lead mới qua Resend (FR-I-03, P1): gộp lead mới trong khoảng cấu hình (mỗi giờ/cuối ngày) gửi người phụ trách/owner — tránh spam email từng lead, dùng domain/địa chỉ gửi đã setup ở Phase 0 prompt #7."
- [ ] "Viết cross-tenant test cho toàn bộ endpoint campaign/product/lead vừa thêm (nối tiếp suite Phase 0, NFR-04)."

**DoD Phase 4**: flow landing → form → lead xuất hiện realtime trong CRM → sales thao tác đầy đủ.

---

## Phase 5 — Payment & fulfillment

> Tiền bạc — đường găng thứ 2 của dự án. Không rút gọn test cho idempotency/checksum-match/double-match.

- [ ] "Implement UI 'Kết nối thanh toán' trong dashboard: org tự nhập thông tin tài khoản SePay của họ (bankBin, accountNumber, accountName, API key/webhook secret) → validate → mã hoá lưu `paymentConnections` (mô hình non-custodial, business-analysis.md §4.4) → trang hướng dẫn từng bước kèm ảnh (FR-D-15). **Đây là bước phải xong trước khi webhook ở prompt #3 có ý nghĩa** — không có kết nối thì không có secret để verify webhook."
- [ ] "Implement tạo Order khi submit lead nếu campaign có sản phẩm trả phí: mã đơn `paymentConfig.transferPrefix` + 6 ký tự base32 (bỏ `0/O/1/I`) + 1 ký tự checksum (thuật toán ở database-schema.md ghi chú #3 — viết hàm tính/validate checksum riêng, có unit test), amount, nội dung CK = mã đơn đầy đủ, sinh VietQR hiển thị trong popup (FR-D-04)."
- [ ] "Implement SePay webhook `/webhooks/sepay` (FR-D-05, architecture.md §7 threat model 'Webhook giả mạo SePay'): verify `Authorization: Apikey <secret>` tra theo `paymentConnections` của org, idempotent theo `providerTxId` (unique index). Trích mã đơn theo đúng 2 bước ở FR-D-05 — **không phải fuzzy match chịu lỗi chung chung**: bước 1 khớp tuyệt đối (mã + checksum hợp lệ, amount khớp CHÍNH XÁC, không có ngưỡng dung sai); bước 2 chỉ chạy khi bước 1 rỗng, sửa lỗi ký tự dễ nhầm rồi validate lại checksum, vẫn yêu cầu amount khớp chính xác + đúng 1 ứng viên. Không tìm được ứng viên duy nhất hoặc order đã `paid`/`refunded` từ trước (double-match, FR-D-14) → không auto-match, ghi `unmatchedTransactions` kèm `reason` — viết test riêng cho từng nhánh (`no_candidate`/`ambiguous`/`already_paid`), đây là nơi dễ sai nhất."
- [ ] "Implement nút 'Tôi đã chuyển khoản' → order `awaiting_confirmation` + popup hướng dẫn + link Zalo; sales xác nhận trong CRM → `paid` (FR-D-06/08, có log + lý do khi đổi trạng thái). Email xác nhận `paid`/`fulfilled` cho lead qua Resend, tuỳ chọn bật/tắt theo campaign (FR-I-04, P1)."
- [ ] "Implement `GET /public/orders/:code/status` poll (hoặc SSE) tối đa 10 phút, quá hạn hiện hướng dẫn manual (FR-D-07); rate limit theo IP + campaign (NFR-16, tránh 1 landing viral kéo sập backend polling); realtime dashboard qua Upstash pub/sub → SSE hub (architecture.md §5.3)."
- [ ] "Màn hình đối soát: liệt kê `unmatchedTransactions` kèm lý do, ambiguous hiển thị order ứng viên xếp hạng theo độ khớp để sales chọn tay, ghi `matchType=manual` (FR-D-09, P1)."
- [ ] "Implement flow hoàn tiền (FR-D-11..14): action 'Yêu cầu hoàn tiền' trên order detail → tạo `refundRequests` → checklist thủ công cho tenant tự chuyển khoản hoàn (nền tảng không giữ tiền, không tự động hoàn) → đánh dấu hoàn tất → order `refunded`. Double-match (giao dịch mới khớp vào order đã `paid`/`refunded`) tự động tạo `refundRequests` reason=`duplicate_payment` + badge cảnh báo CRM, không tự fulfillment lại — viết test riêng cho case double-match này."
- [ ] "Hoàn thiện `landing-runtime` v2: render QR, poll status, chuỗi popup (đăng ký thành công → đang chờ/paid → hướng dẫn Zalo) — FR-D-01 đầy đủ."
- [ ] "Viết test: webhook replay (gọi lại cùng `providerTxId`) không được tạo double-paid; chuyển khoản đúng mã đơn + checksum hợp lệ auto-match; amount lệch dù mã đúng **không** được match (không có ngưỡng dung sai — khác thiết kế cũ, xác nhận lại nếu Claude tự thêm tolerance)."

**DoD Phase 5**: chuyển khoản thật 10k → popup thành công tự bật ≤30s; webhook replay không double-paid; kịch bản manual đủ. *(Mốc dogfood — chạy khoá học thật của bạn trên nền tảng.)*

---

## Phase 6 — Import, Draw, hoàn thiện

- [ ] "Implement import pipeline (FR-B-30): paste HTML / upload .html hoặc .zip / paste link artifact công khai → sanitize (strip script nguy hiểm, tracker lạ) → tách inline assets → generate srcmap → đặt tên layer tự động (heuristic + AI) → mở trong Studio. Chú ý threat model SSRF qua import URL (architecture.md §7): chỉ fetch qua proxy allowlist scheme/deny private IP. Ảnh trong HTML import trỏ URL ngoài không rõ nguồn: gắn cờ `pageAssets.unverifiedSource=true`, yêu cầu tenant tick xác nhận 'Tôi có quyền sử dụng ảnh này' trước khi publish landing chứa ảnh gắn cờ (FR-B-35)."
- [ ] "Wizard 'chuẩn hoá phễu' sau import: AI đề xuất gắn form đăng ký chuẩn của nền tảng + meta SEO nếu thiếu (FR-B-31, P1)."
- [ ] "Implement Draw mode (FR-B-14, P1): vẽ annotation đè lên preview (mũi tên, khung, freehand) → chụp composite gửi AI kèm text."
- [ ] "Custom domain tenant (FR-G-04, P1): CNAME + auto cert qua Cloudflare for SaaS, trạng thái verify hiển thị rõ."
- [ ] "Audit log UI (FR-A-05, P1): mọi hành động ghi (publish, xoá lead, đổi trạng thái đơn...)."
- [ ] "Export CSV theo filter lead (FR-E-07, P1); email notify lead mới (FR-E-08, P1)."
- [ ] "Polish UX non-tech: mode đơn giản mặc định, onboarding checklist, empty state tiếng Việt tử tế — không cần agent, tự làm trực tiếp cho phần copy/UI này."
- [ ] "Implement quyền dữ liệu cá nhân cho lead (NFR-10, tuân thủ Nghị định 13/2023/NĐ-CP): quy trình yêu cầu xoá/xuất dữ liệu cá nhân (endpoint hoặc email hỗ trợ có SLA 72h) → anonymize `phone`/`email`/`customFields`, giữ `orders`/`payments` ẩn danh nếu đã có giao dịch. Job retention định kỳ (NFR-11): lead chưa từng `paid` không hoạt động sau 12 tháng → tự động anonymize, tenant tắt được qua `organizations.settings` — **khác** với job prune `pageVersions` ở backlog, đây là dữ liệu lead."
- [ ] "Chạy pentest checklist OWASP top 10 áp threat model architecture.md §7 (review bảo mật đoạn xử lý payment/auth/upload — nói rõ từ 'bảo mật' để route đúng agent); load test webhook SePay + public endpoints, xác nhận API p95 < 300ms trừ AI streaming và webhook xử lý < 2s (NFR-03)."
- [ ] "Xác nhận backup & uptime: Neon PITR bật, R2 versioning bật cho bucket deployments (NFR-06); đo lại NFR-02 (TTI dashboard, route transition) trên build production thật, không chỉ dev — sửa nếu lệch ngưỡng."

**DoD Phase 6**: học viên thật import HTML từ Claude.ai và publish không cần hỗ trợ; toàn bộ NFR-01..16 đã đo và đạt ngưỡng functional-requirements.md.

---

## Phase 7 (khi chạm ngưỡng infra-deployment-cost.md §2) — VPS & scale

- [ ] "Setup Dokploy stack trên VPS Việt Nam theo `docs/ops/infra-deployment-cost.md`; viết migration runbook CF→VPS cho api + DB."
- [ ] "Đổi driver `jobs` sang BullMQ, `storage` sang S3-compatible, `realtime` sang Redis pub/sub — chỉ đổi impl trong `packages/drivers`, business code không đổi (đúng nguyên tắc portable architecture.md §1 nguyên tắc #2)."
- [ ] "Thumbnail/screenshot server-side qua Playwright chạy job VPS (thay browser rendering CF)."
- [ ] "Setup monitoring Grafana cho VPS (thay CF analytics)."

---

## Roadmap / backlog P2 (sau Phase 6, review theo implementation-plan.md — "scope creep → backlog P2")

Không chạy các prompt này trước khi hết Phase 6 (đúng đối sách rủi ro "scope creep" trong implementation-plan.md — Phase 7/VPS chỉ chạy khi chạm ngưỡng infra, không phải điều kiện để mở backlog P2) — nhưng viết sẵn ở đây để không phải phân tích lại docs khi tới lúc cần:

- [ ] "Implement 2FA TOTP cho owner/admin (FR-A-06)."
- [ ] "Implement voice input Web Speech API cho chat sidebar (FR-B-25)."
- [ ] "Implement marketplace skill — chia sẻ skill giữa tenant (FR-F-05)."
- [ ] "Thêm `product_type` mới (event, membership...) chỉ qua attribute schema, không đổi DB (FR-C-06) — dùng làm test cho tính extensible đã thiết kế ở Phase 4."
- [ ] "Thêm payment provider VNPAY/MoMo/Casso/PayOS qua interface `payments` đã có ở `packages/drivers` (FR-D-10) — chỉ thêm impl mới + trang hướng dẫn riêng (FR-D-15), không đổi interface. Ưu tiên theo nhu cầu tenant thật, không làm trước khi có ai cần."
- [ ] "Zalo OA/Telegram webhook cho thông báo lead mới (FR-E-08 P2 — phần email digest P1 đã làm ở Phase 4 prompt #6b)."
- [ ] "Tags, saved views, bulk actions cho CRM lead list (FR-E-09)."
- [ ] "Đăng ký + tích hợp chương trình chính thức 'Sign in with Claude'/'Sign in with ChatGPT' nếu được duyệt (FR-H-04) — đọc kỹ ràng buộc ToS ở ai-integration-byok.md trước khi code, đây là quyết định business trước, không phải việc kỹ thuật thuần."
- [ ] "Analytics nhẹ first-party không cookie bên thứ ba, đếm ở edge (FR-G-06, P1 — có thể làm sớm hơn nếu cần data cho sales pitch)."
- [ ] "Migrate video landing sang Bunny Stream cho landing vượt ~5GB egress-tương-đương/tháng (NFR-15) — thêm driver `video` mới trong `packages/drivers`, R2 raw file giữ nguyên làm mặc định cho landing nhẹ."
- [ ] "Job prune `pageVersions` trung gian (không phải deployment hiện tại, không có label) sau 90 ngày hoặc khi vượt 50 version/page (infra-deployment-cost.md §2, database-schema.md ghi chú #1) — set `prunedAt` + xoá object R2, giữ row Postgres."

## Việc không phải prompt code (nhắc lại từ implementation-plan.md, làm trước hoặc song song Phase 0)

- [ ] Chốt tên miền nền tảng.
- [ ] Đăng ký developer interest "Sign in with ChatGPT" + liên hệ Anthropic về usage credits.
- [ ] Đăng ký SePay + mở tài khoản test webhook.
- [ ] Viết nháp nội dung 4 platform skill (dùng ở prompt Phase 2 #9) — đây là moat, không phải việc AI viết hộ.
- [ ] Soạn Chính sách bảo mật + điều khoản xử lý dữ liệu cá nhân (DPA) công bố nền tảng là Bên xử lý dữ liệu, tenant là Bên kiểm soát dữ liệu; disclose việc lưu trữ dữ liệu ở hạ tầng nước ngoài (Cloudflare/Neon) — NFR-12/13, functional-requirements.md. Việc pháp lý/văn bản, không phải prompt code.
