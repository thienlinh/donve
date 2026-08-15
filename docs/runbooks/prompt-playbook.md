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

---

## Phase 0 — Nền móng

1. "Setup monorepo Turborepo + Bun workspaces theo đúng `.claude/rules/tech-stack.md` và `docs/architecture/architecture.md` §3: tạo cấu trúc `apps/`, `packages/` rỗng (chỉ package.json + tsconfig đúng preset), root `turbo.json`, `.oxlintrc.json`, `.oxfmtrc.json`, CI (lint/typecheck/test/build + remote cache). Việc này đụng nhiều package — thiết kế cấu trúc trước khi viết code."
2. "Tạo `packages/contracts`: zod schema cho toàn bộ entity ở `docs/architecture/database-schema.md` (org, user, membership, product, campaign, landing, lead, order, payment, ai_connection...). Chỉ schema + types, chưa cần DB thật."
3. "Tạo `packages/db`: Drizzle schema đúng `docs/architecture/database-schema.md`, migration, seed script, repository pattern — mọi hàm query bắt buộc nhận `orgId`, không có hàm 'query trần' (NFR-04, architecture.md §6)."
4. "Tạo `packages/auth`: Better Auth + organization plugin + RBAC theo bảng quyền ở `docs/architecture/architecture.md` §6 (owner/admin/editor/sales) — FR-A-01 đến FR-A-04."
5. "Tạo `packages/drivers`: interface `jobs`, `storage`, `cache`, `realtime`, `payments` (chưa cần impl VPS) + impl Cloudflare (QStash, R2, Upstash, SSE-hub, SePay) — đúng nguyên tắc portable ở architecture.md §1.2. Đây là boundary quan trọng nhất cho migration CF↔VPS sau này, thiết kế trước khi code."
6. "Tạo `apps/api` skeleton Hono với 2 entrypoint `workers.ts` (CF) và `bun.ts` (VPS), error handling chuẩn, structured logging JSON (requestId, orgId — architecture.md §8), rate limit middleware."
7. "Tạo `apps/dashboard` skeleton: Vite 8 + React 19 + TanStack Router, layout cơ bản, auth flow (login/signup/verify email), org switcher, code-split theo route/module để đạt TTI < 3s lần đầu và chuyển route < 200ms (NFR-02), i18n scaffold tiếng Việt với kiến trúc message catalog ICU để thêm EN sau (NFR-07)."
8. "Viết cross-tenant test suite: user org A gọi mọi endpoint hiện có với id thuộc org B phải trả 404/403 (NFR-04, architecture.md §6) — viết test cho các endpoint auth/org vừa tạo, cả edge case."
9. "Setup CI/CD theo infra-deployment-cost.md §6: GitHub Actions chạy `turbo run lint typecheck test build` (affected-only qua remote cache), 3 environment `dev` (miniflare/wrangler dev + Neon branch)/`staging` (Neon branch riêng)/`prod`, secrets qua Wrangler secrets tách riêng masterKey mã hoá BYOK (rotate được sau này); deploy staging tự động (CF Pages + Workers) cho `apps/dashboard` + `apps/api`."

**Trước khi qua Phase 1**: đối chiếu DoD — đăng ký → tạo org → mời member → phân quyền hoạt động; cross-tenant suite xanh; deploy staging tự động.

---

## Phase 2 — Studio core

> Lưu ý: đây là port code có sẵn (`dv-studio-kit`), không viết mới từ đầu — nói rõ điều này trong prompt để Claude không tự generate lại logic đã có.

1. "Port `@dv/core` vào `packages/studio-core` (srcmap engine, patch ops, undo/redo) — giữ nguyên logic, chỉ đổi package name theo `@dv/<name>` convention và path import. Đây là package độc lập, không biết gì về CRM (architecture.md §1.3)."
2. "Port `@dv/studio` vào `packages/studio-ui` (Canvas, LayerTree, Inspector, mode system view/select/edit/comment/draw) tương tự."
3. "Port `@dv/ai` vào `packages/studio-ai` (patch protocol, prompt compiler khung sườn — chưa cần gọi API thật, để Phase 2 AI nối vào)."
4. "Wiring `packages/studio-*` vào `apps/dashboard` như feature module L2 (`features/studio`) theo mô hình 4 lớp L0→L3 ở architecture.md §3."
5. "Implement layout tổng thể Studio đúng studio-builder-spec.md §2: TopBar (tên dự án, Share/New/⋯), ChatPanel trái thu gọn/mở rộng (FR-B-01/02), WorkArea phải với tab Design Files / `<Page>.html`, toolbar canvas (`+Tweaks`, `Comment`, `Edit`, `Draw`, zoom indicator) và top bar `Export` (dropdown HTML/ZIP/PNG)/`Present` (fullscreen preview)/`Download`/`Share` (FR-B-03) — `panelSizes`/`chatCollapsed`/`activeTab` persist localStorage per user. Việc này là khung UI toàn bộ studio, thiết kế state/layout trước khi cắm canvas engine vào."
6. "Implement canvas iframe sandboxed load HTML thật (FR-B-04), zoom 10%-400% (touchpad pinch, `Cmd +/-`, nút UI, zoom quanh con trỏ — FR-B-05), pan (space-drag, two-finger scroll, middle-mouse), fit-to-screen mặc định + double-click reset (FR-B-07). Test matrix Safari/Chrome/Firefox ngay từ đầu — đây là rủi ro kỹ thuật đã biết (implementation-plan.md bảng rủi ro)."
7. "Implement hover (border nét đứt + label tag dạng `span [cc-2] 'STREET'`) và click-select (border nét liền, đồng bộ highlight LayerTree) — FR-B-08/09, đúng screenshot #4/#6."
8. "Implement Edit mode inspector: properties panel Typography/Size/Box, apply trực tiếp qua srcmap + cập nhật preview tức thì không reload iframe (FR-B-10); inline text edit contenteditable double-click, commit khi Enter/blur (FR-B-11)."
9. "Implement LayerTree panel: liệt kê element có ngữ nghĩa, icon loại, toggle ẩn/hiện, click scroll-into-view, hover highlight (FR-B-16/17); rename layer (FR-B-18, P1); kéo thả đổi thứ tự (FR-B-19, P1)."
10. "Implement Undo/Redo toàn cục cho mọi thay đổi source (manual edit, inline text — AI patch nối ở Phase 2), `Cmd+Z`/`Shift+Cmd+Z`, ≥100 bước trong session (FR-B-15); đầy đủ keyboard map studio-builder-spec.md §9 (V/E/C/D đổi mode, Cmd+S force save, Delete xoá element có confirm khi section lớn, Esc bỏ chọn/đóng modal) — dashboard phải điều hướng được hoàn toàn bằng bàn phím ở studio, focus ring rõ (NFR-08)."
11. "Implement tab Design Files (cây FOLDERS/PAGES/DATA/IMAGES — screenshot #2), upload ảnh assets (drag-drop, nén + WebP/AVIF — FR-B-29), version history (list, diff, restore, đặt nhãn — FR-B-27), thumbnail client-side sau mỗi save."
12. "Implement Export (FR-B-28): dropdown ở top bar xuất HTML đơn file, ZIP kèm assets, PNG full-page (chụp qua `modern-screenshot` client-side)."
13. "Viết test cho toàn bộ patch ops của studio-core (replaceText, setStyle, setAttr, replaceOuterHTML, insertBefore/After, remove, toggleVisibility, renameLayer) — đảm bảo undo/redo đúng cho từng loại, cả edge case (patch vào element đã bị xoá, patch chồng lấn)."

**DoD Phase 2**: mở 1 file HTML seed, chỉnh manual đầy đủ như screenshot #1/#3/#4/#6, version/restore chạy; keyboard map hoạt động; export HTML/ZIP/PNG ra đúng file.

---

## Phase 3 — AI layer

> Đường găng của cả dự án (implementation-plan.md) — đừng rút gọn test bench, đây là phase quyết định AI patch có tin cậy được không.

1. "Tạo `packages/ai-gateway`: provider abstraction **OpenRouter (mặc định) + Anthropic + OpenAI** qua AI SDK v6, key vault mã hoá AES-256-GCM (NFR-05), usage metering theo token. Đây là boundary bảo mật quan trọng — review kỹ phần lưu/giải mã key."
2. "Implement BYOK UI trong dashboard: connect API key (mặc định gợi ý OpenRouter trước — key duy nhất, có model free để test), validate bằng call thử, chọn model mặc định (FR-H-01); routing trong ai-gateway — nếu `connectionId=platform` thì check `aiCreditBalance` trước khi stream, ghi `aiUsage` + trừ credit sau trong 1 transaction, hiển thị usage cho tenant (FR-H-02, gói trả phí); chọn model mạnh cho generate lần đầu, model rẻ (DeepSeek qua OpenRouter/Haiku) cho patch nhỏ/đặt tên layer để tiết kiệm chi phí (ai-integration-byok.md §2, §6)."
3. "Implement Chat UI bằng AI SDK v6 `useChat` + AI Elements (Conversation, Message, PromptInput, Reasoning): streaming, đính ảnh, suggestion chips (FR-B-20)."
4. "Implement prompt compiler trong `packages/studio-ai`: base prompt + skills đang bật + design tokens + srcmap context + comment queue → system prompt cuối cùng (architecture.md §5.1, FR-B-24)."
5. "Implement tool call `apply_patch` end-to-end theo schema ai-integration-byok.md §4: server validate ops bằng studio-core → áp lên HTML hiện tại → tạo `page_version` mới → trả patch cho client; client áp cùng patch vào DOM iframe optimistic (không reload) + đẩy undo stack (FR-B-22/23). Fallback full-file khi patch validate fail."
6. "Bảo vệ prompt injection: nội dung trang import/AI đọc phải bọc trong delimiter rõ ràng, system prompt chỉ định đó là data không phải lệnh (architecture.md §7) — review lại đoạn xử lý này, đây là input không tin cậy đi thẳng vào AI."
7. "Implement generate lần đầu: prompt → AI sinh HTML single-file inline CSS tuân theo skills đang bật → hiện canvas + tự tạo srcmap + layer tree (FR-B-21)."
8. "Implement Comment mode: click element → modal (textarea, đính ảnh P1) → Queue hoặc Send to Chat; comment gửi = message kèm ngữ cảnh element (srcmap id, ảnh crop, selector), hiển thị chip 'Commented on element' trong chat (FR-B-12); queue có badge đếm + nút 'Send all' gộp 1 request AI (FR-B-13)."
9. "Tạo `packages/db` migration + CRUD cho Skill (FR-F-01) và Prompt template (FR-F-03, biến `{{brand}}`/`{{product}}`/`{{tone}}`, versioning, preview compiled prompt). Viết nội dung 4 skill nền tảng: `seo-landing-vn`, `cwv-budget`, `copywriting-chuyen-doi`, `form-phễu-chuẩn` (đây là moat theo implementation-plan.md — nội dung do bạn viết, Claude chỉ dựng CRUD/UI, không tự bịa nội dung dạy học)."
10. "Test bench prompt (FR-F-04, P1): chạy 1 prompt với model chọn, chạy Lighthouse sandbox trên output, so sánh 2 version — cần cho eval set 20 trang mẫu regression mỗi khi đổi prompt (implementation-plan.md đối sách rủi ro AI patch)."

**DoD Phase 3**: prompt → landing hoàn chỉnh có srcmap + layer đặt tên; comment 1 element → AI sửa đúng element; đổi model/provider giữa chừng OK.

---

## Phase 4 — Publishing

1. "Tạo `apps/edge-router` CF Worker: KV hostname→deployment_id, R2 deployments/<id>/*, Cache API immutable, event beacon `/e/*` (architecture.md §2)."
2. "Implement build pipeline publish (architecture.md §5.2): sanitize → minify html/css → hash assets → rewrite URL → inject runtime script defer + meta/OG/JSON-LD + canonical + beacon → upload R2 → KV put hostname → warm cache + chụp thumbnail (FR-G-01)."
3. "Tạo `apps/landing-runtime` v1 (vanilla TS ~5-8KB, build IIFE qua tsdown — package compiled duy nhất, đúng ngoại lệ ở `.claude/rules/tech-stack.md`): chỉ form + popup đăng ký, chưa cần payment (FR-D-01 rút gọn cho phase này)."
4. "Implement Publish/Rollback/Unpublish UI trong dashboard: rollback = KV put trỏ deployId cũ, tức thời (FR-G-01/02); mỗi deployment gắn snapshot version audit được (FR-G-03)."
5. "Implement wildcard subdomain (validate trùng + reserved words, FR-G-01) và SEO tự động: sitemap.xml + robots.txt per subdomain, canonical, OG image từ thumbnail, JSON-LD từ product/course gắn campaign (FR-G-05)."
6. "Setup Lighthouse CI trong `tooling/lighthouse-ci` chạy trên mỗi deployment mẫu — gate NFR-01 (Performance/SEO/BestPractices/A11y ≥95 mobile, LCP <1.8s 4G VN, JS runtime ≤10KB gzip)."

**DoD Phase 4**: publish < 30s, Lighthouse ≥ 95 mobile trên landing mẫu, rollback tức thời.

---

## Phase 5 — Campaign/Product/Course + CRM

1. "CRUD Product (FR-C-01: tên, giá, mô tả, ảnh, `type` + JSONB attributes extensible) và Course (FR-C-02: product type=course + link nhóm Zalo, hướng dẫn kích hoạt, lịch khai giảng)."
2. "CRUD Campaign (FR-C-03/04): gắn n product, n landing, thời gian, mục tiêu, UTM mặc định, formConfig (fields bật, dropdown 'Bạn đang là ai?' tuỳ biến — screenshot #7), popupConfig, paymentConfig (VietQR account, template nội dung CK, bật/tắt SePay, link Zalo)."
3. "Implement `POST /public/leads` (FR-D-02/03): nhận field theo `campaign.formConfig` (họ tên, SĐT VN, email optional, persona 'Bạn đang là ai?', custom fields text/select/checkbox), validate SĐT VN, Turnstile invisible, rate limit IP + honeypot, dedupe theo SĐT trong org (FR-E-06)."
4. "CRM: danh sách lead (filter campaign/product/trạng thái/UTM/ngày/người phụ trách, full-text search, phân trang server-side — FR-E-01), pipeline kanban kéo thả cấu hình theo org (FR-E-02)."
5. "Chi tiết lead: timeline activities, thông tin đơn + thanh toán, campaign nguồn (FR-E-03); assignment gán tay/round-robin theo campaign, sales chỉ thấy lead được gán nếu cấu hình vậy (FR-E-04); hành động nhanh `tel:`, copy SĐT, mở Zalo, xác nhận thanh toán, đánh dấu fulfilled (FR-E-05)."
6. "Analytics cơ bản campaign: views/submits/conversion rate theo ngày, đọc từ bảng `events` append-only (FR-C-05, architecture.md §8)."
7. "Viết cross-tenant test cho toàn bộ endpoint campaign/product/lead vừa thêm (nối tiếp suite Phase 0, NFR-04)."

**DoD Phase 5**: flow landing → form → lead xuất hiện realtime trong CRM → sales thao tác đầy đủ.

---

## Phase 6 — Payment & fulfillment

> Tiền bạc — đường găng thứ 2 của dự án. Không rút gọn test cho idempotency/fuzzy-match.

1. "Implement tạo Order khi submit lead nếu campaign có sản phẩm trả phí: mã đơn ngắn duy nhất (vd `DV4F7K`), amount, nội dung CK = mã đơn, sinh VietQR hiển thị trong popup (FR-D-04)."
2. "Implement SePay webhook `/webhooks/sepay` (FR-D-05, architecture.md §7 threat model 'Webhook giả mạo SePay'): verify `Authorization: Apikey <secret>` per-org, idempotent theo transaction id (unique index), fuzzy match mã đơn trong nội dung CK (chịu lỗi gõ thiếu/thừa ký tự) + khớp amount ± ngưỡng cấu hình; mơ hồ (2 đơn cùng amount trong cửa sổ thời gian) → không bao giờ auto-match, đẩy vào `unmatched_transactions` — viết test riêng cho case ambiguous này, đây là nơi dễ sai nhất."
3. "Implement nút 'Tôi đã chuyển khoản' → order `awaiting_confirmation` + popup hướng dẫn + link Zalo; sales xác nhận trong CRM → `paid` (FR-D-06/08, có log + lý do khi đổi trạng thái)."
4. "Implement `GET /public/orders/:code/status` poll (hoặc SSE) tối đa 10 phút, quá hạn hiện hướng dẫn manual (FR-D-07); realtime dashboard qua Upstash pub/sub → SSE hub (architecture.md §5.3)."
5. "Màn hình đối soát: liệt kê giao dịch SePay chưa khớp đơn nào, kéo-thả gán tay (FR-D-09, P1)."
6. "Hoàn thiện `landing-runtime` v2: render QR, poll status, chuỗi popup (đăng ký thành công → đang chờ/paid → hướng dẫn Zalo) — FR-D-01 đầy đủ."
7. "Viết test: webhook replay (gọi lại cùng transaction id) không được tạo double-paid; chuyển khoản đúng mã đơn ± sai lệch amount nhỏ vẫn match theo ngưỡng cấu hình."

**DoD Phase 6**: chuyển khoản thật 10k → popup thành công tự bật ≤30s; webhook replay không double-paid; kịch bản manual đủ. *(Mốc dogfood — chạy khoá học thật của bạn trên nền tảng.)*

---

## Phase 7 — Import, Draw, hoàn thiện

1. "Implement import pipeline (FR-B-30): paste HTML / upload .html hoặc .zip / paste link artifact công khai → sanitize (strip script nguy hiểm, tracker lạ) → tách inline assets → generate srcmap → đặt tên layer tự động (heuristic + AI) → mở trong Studio. Chú ý threat model SSRF qua import URL (architecture.md §7): chỉ fetch qua proxy allowlist scheme/deny private IP."
2. "Wizard 'chuẩn hoá phễu' sau import: AI đề xuất gắn form đăng ký chuẩn của nền tảng + meta SEO nếu thiếu (FR-B-31, P1)."
3. "Implement Draw mode (FR-B-14, P1): vẽ annotation đè lên preview (mũi tên, khung, freehand) → chụp composite gửi AI kèm text."
4. "Custom domain tenant (FR-G-04, P1): CNAME + auto cert qua Cloudflare for SaaS, trạng thái verify hiển thị rõ."
5. "Audit log UI (FR-A-05, P1): mọi hành động ghi (publish, xoá lead, đổi trạng thái đơn...)."
6. "Export CSV theo filter lead (FR-E-07, P1); email notify lead mới (FR-E-08, P1)."
7. "Polish UX non-tech: mode đơn giản mặc định, onboarding checklist, empty state tiếng Việt tử tế — không cần agent, tự làm trực tiếp cho phần copy/UI này."
8. "Chạy pentest checklist OWASP top 10 áp threat model architecture.md §7 (review bảo mật đoạn xử lý payment/auth/upload — nói rõ từ 'bảo mật' để route đúng agent); load test webhook SePay + public endpoints, xác nhận API p95 < 300ms trừ AI streaming và webhook xử lý < 2s (NFR-03)."
9. "Xác nhận backup & uptime: Neon PITR bật, R2 versioning bật cho bucket deployments (NFR-06); đo lại NFR-02 (TTI dashboard, route transition) trên build production thật, không chỉ dev — sửa nếu lệch ngưỡng."

**DoD Phase 7**: học viên thật import HTML từ Claude.ai và publish không cần hỗ trợ; toàn bộ NFR-01..08 đã đo và đạt ngưỡng functional-requirements.md.

---

## Phase 8 (khi chạm ngưỡng infra-deployment-cost.md §2) — VPS & scale

1. "Setup Dokploy stack trên VPS Việt Nam theo `docs/ops/infra-deployment-cost.md`; viết migration runbook CF→VPS cho api + DB."
2. "Đổi driver `jobs` sang BullMQ, `storage` sang S3-compatible, `realtime` sang Redis pub/sub — chỉ đổi impl trong `packages/drivers`, business code không đổi (đúng nguyên tắc portable architecture.md §1.2)."
3. "Thumbnail/screenshot server-side qua Playwright chạy job VPS (thay browser rendering CF)."
4. "Setup monitoring Grafana cho VPS (thay CF analytics)."

---

## Roadmap / backlog P2 (sau Phase 7, review theo implementation-plan.md — "scope creep → backlog P2")

Không chạy các prompt này trước khi hết Phase 7 (đúng đối sách rủi ro "scope creep" trong implementation-plan.md) — nhưng viết sẵn ở đây để không phải phân tích lại docs khi tới lúc cần:

- "Implement 2FA TOTP cho owner/admin (FR-A-06)."
- "Implement voice input Web Speech API cho chat sidebar (FR-B-25)."
- "Implement marketplace skill — chia sẻ skill giữa tenant (FR-F-05)."
- "Thêm `product_type` mới (event, membership...) chỉ qua attribute schema, không đổi DB (FR-C-06) — dùng làm test cho tính extensible đã thiết kế ở Phase 5."
- "Thêm payment provider Casso/PayOS/MoMo qua interface `payments` đã có ở `packages/drivers` (FR-D-10) — chỉ thêm impl mới, không đổi interface."
- "Zalo OA/Telegram webhook cho thông báo lead mới (FR-E-08 P2)."
- "Tags, saved views, bulk actions cho CRM lead list (FR-E-09)."
- "Đăng ký + tích hợp chương trình chính thức 'Sign in with Claude'/'Sign in with ChatGPT' nếu được duyệt (FR-H-04) — đọc kỹ ràng buộc ToS ở ai-integration-byok.md trước khi code, đây là quyết định business trước, không phải việc kỹ thuật thuần."
- "OpenRouter làm provider thứ 3 trong `packages/ai-gateway` (FR-H-03)."
- "Analytics nhẹ first-party không cookie bên thứ ba, đếm ở edge (FR-G-06, P1 — có thể làm sớm hơn nếu cần data cho sales pitch)."

## Việc không phải prompt code (nhắc lại từ implementation-plan.md, làm trước hoặc song song Phase 0)

1. Chốt tên miền nền tảng.
2. Đăng ký developer interest "Sign in with ChatGPT" + liên hệ Anthropic về usage credits.
3. Đăng ký SePay + mở tài khoản test webhook.
4. Viết nháp nội dung 4 platform skill (dùng ở prompt Phase 3 #9) — đây là moat, không phải việc AI viết hộ.
