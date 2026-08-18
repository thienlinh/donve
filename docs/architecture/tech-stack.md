# 09 — Tech Stack chi tiết (verified 15/08/2026)

> Mọi version dưới đây được query trực tiếp từ npm registry ngày 15/08/2026 — không phải số liệu nhớ từ training data. Nguyên tắc chọn: **mới nhất nhưng đã stable**, ưu tiên Rust-based toolchain (Oxc/Rolldown hệ sinh thái), và **tối ưu thời gian thực hiện** (mỗi lựa chọn ghi rõ "tiết kiệm gì").

## 0. Ba thay đổi lớn của 2026 mà stack này tận dụng

1. **TypeScript 7 GA (08/07/2026)** — compiler viết lại bằng Go, type-check nhanh ~10×, chạy song song (`--checkers`, `--builders`). Cài qua chính package `typescript`, binary vẫn là `tsc` (tên `tsgo` chỉ còn ở nightly `@typescript/native-preview`). ⚠️ Caveat duy nhất: **chưa có programmatic API stable (đợi 7.1)** → tool nào embed TS API (typescript-eslint, ts-morph, Volar) chưa dùng được. **Không ảnh hưởng chúng ta** vì lint dùng Oxlint (không cần TS API) — đây chính là lý do chọn Oxlint càng đúng. Nguồn: devblogs.microsoft.com/typescript, infoq.com/news/2026/08/typescript-7-released.
2. **Vite 8 (stable 03/2026)** — Rolldown (Rust) thay cặp esbuild+Rollup, build nhanh 10–30×, dev/prod cùng một engine (hết class bug "dev chạy prod vỡ"). `@vitejs/plugin-react` v6 dùng Oxc cho React Refresh, **bỏ hẳn Babel**; React Compiler opt-in qua `reactCompilerPreset`. ESM-only, yêu cầu Node ≥ 20.19 / ≥ 22.12. Nguồn: vite.dev/blog/announcing-vite8.
3. **AI SDK 7 (25/06/2026)** — từ "chat wrapper" thành agent platform: `ToolLoopAgent`, tool approvals, typed tool runtime context, reasoning control, telemetry hợp nhất, `WorkflowAgent` (durable). Vòng lặp "AI trả `apply_patch` → validate → retry" của studio map thẳng vào `ToolLoopAgent` — đỡ tự viết state machine. Nguồn: vercel.com/blog/ai-sdk-7.

## 1. Bảng version chuẩn (pin vào bun catalog)

### Ngôn ngữ, runtime, monorepo

| Package | Version | Ghi chú quyết định |
| --- | --- | --- |
| `typescript` | **7.0.2** | Go-native GA. `strict` + `esnext` là default mới; deprecations của 6.0 thành hard error → codebase mới không dính gì |
| Node.js | **22 LTS** (engines `>=22.12`) | Yêu cầu tối thiểu của Vite 8; CI + VPS đồng nhất |
| Bun | **1.3.x** (`bun-types` 1.3.14) | Runtime cho `apps/api` entrypoint VPS + test runner phụ; không dùng làm package manager (bun catalog tốt hơn cho monorepo) |
| bun | **1.3.4** + **catalogs** | `catalogs:` trong root `package.json` = một nguồn version duy nhất cho cả monorepo — hết drift version giữa packages, đổi version 1 chỗ |
| `turbo` | **2.10.10** | Remote cache (Vercel free hoặc self-host lên R2) |
| `oxlint` | **1.78.0** | Rust, nhanh hơn ESLint ~50–100×, type-aware rules ngày càng đủ; chạy được trong pre-commit không cảm nhận độ trễ |
| `oxfmt` | **0.63.0** | Thay Prettier, cùng hệ Oxc. Còn pre-1.0 → pin exact version trong catalog, format output có thể đổi nhẹ giữa minor |
| `vitest` | **4.1.10** | Unit/integration; chạy trên cả workspace |
| `@testing-library/react` + `@testing-library/user-event` | **17.x** / **14.x** | Component test dashboard (đặc biệt studio: hover/select/edit mode) — test theo hành vi user thay vì implementation detail |
| `msw` | **2.12.x** | Mock API layer cho test component + dev local không cần chạy `apps/api` thật (đặc biệt hữu ích test studio/CRM UI độc lập, tăng tốc dev loop) |
| `playwright` / `@playwright/test` | **1.62.1** | E2E dashboard + engine chụp thumbnail/screenshot server-side (VPS phase) |

### Frontend (`apps/dashboard`)

| Package | Version | Ghi chú |
| --- | --- | --- |
| `react` / `react-dom` | **19.2.8** | React 19.2: Activity, `useEffectEvent`, View Transitions ổn định dần |
| `babel-plugin-react-compiler` | **1.0.0** | **React Compiler đã 1.0** — bật qua `reactCompilerPreset` của plugin-react v6. Tiết kiệm lớn: gần như khỏi viết `useMemo`/`useCallback` thủ công trong studio (nơi re-render nhạy nhất) |
| `vite` | **8.2.1** | Rolldown default; `build.rolldownOptions` (rollupOptions deprecated) |
| `@vitejs/plugin-react` | **6.0.5** | Oxc-based, không Babel trừ khi bật compiler preset |
| `tailwindcss` | **4.3.3** | v4: CSS-first config (`@theme`), Oxide engine; token override strategy bạn đã có sẵn từ dự án trước |
| shadcn/ui | CLI latest, **variant Base UI** (không pin — copy-in code) | + `tw-animate-css`; components là code của mình → không có "version" runtime. Chọn variant **Base UI** (không phải Radix) vì đây là hướng shadcn đang đầu tư (đổi 07/2026: Toast/Popover... build thẳng trên Base UI primitive, tránh phải quyết định lại theo từng component sau này) |
| `lucide-react` | **1.31.0** | Icon (lưu ý đã lên 1.x, API import không đổi) |
| `@tanstack/react-router` | **1.170.29** | Type-safe routing, search params validation bằng zod — hợp CRM filter-heavy |
| `@tanstack/react-query` | **5.101.4** | Server state; bạn đã có reference guide v5 tự viết |
| `@tanstack/react-virtual` | **3.14.9** | LayerTree/leads list ảo hoá |
| `@dnd-kit/core` + `@dnd-kit/sortable` | **6.3.1** / **10.0.0** | Kéo thả: kanban CRM (FR-E-02), layer reorder (FR-B-19), reorder section prompt template (FR-F-03). Thay `react-beautiful-dnd` (đã ngừng bảo trì từ Atlassian) — dnd-kit modern, accessible (keyboard dnd), tree-shakeable, 1 lib dùng chung mọi nơi kéo-thả trong dashboard thay vì mỗi chỗ 1 lib khác nhau |
| `@ai-sdk/react` | **4.0.69** | `useChat` cho studio chat (đi cùng `ai` v7) |
| AI Elements | registry components (shadcn-style, copy-in) | Conversation/Message/PromptInput/Reasoning — dựng chat UI trong ~1 ngày thay vì 1 tuần. Chọn thay `@assistant-ui/react` (0.15.x) vì cần custom sâu chip comment/annotation; assistant-ui trừu tượng cao hơn nhưng khó "mổ" |
| `streamdown` | **2.5.0** | `Message`/`MessageResponse` của AI Elements **đã dùng streamdown nội bộ** để render markdown streaming (GFM built-in: table/task-list/strikethrough) — không cần cài `react-markdown`+`remark-gfm` riêng cho chat. Nhớ import CSS của streamdown (bắt buộc, nếu thiếu style không áp). Tái dùng luôn package này cho markdown preview Skill/Prompt template (FR-F-01/03) thay vì thêm 1 lib markdown thứ 2 — streamdown là "drop-in replacement cho react-markdown", dùng standalone được ngoài context chat |
| `modern-screenshot` | **4.7.0** | Chụp iframe → thumbnail/composite draw-mode phía client. Thay thế hiện đại của html2canvas (nhanh hơn, ít bug CSS hơn) |
| `zod` | **4.4.3** | v4: nhanh hơn nhiều, `z.interface`, bundle nhỏ; dùng chung FE/BE qua `packages/contracts` |
| `react-hook-form` + `@hookform/resolvers` | **7.65.x** / **5.2.x** | Mọi form CRUD trong dashboard (product/campaign/skill/prompt config...) — resolver dùng thẳng schema `zod` đã có trong `contracts`, không viết validate 2 lần. Không dùng TanStack Form: react-hook-form phổ biến hơn, ít re-render hơn nhờ uncontrolled inputs, đủ cho form-heavy CRM/campaign config |
| `recharts` | **3.2.x** | Chart cho FR-C-05 (dashboard campaign) và FR-G-06 (analytics landing) — cùng hệ với shadcn/ui charts registry (copy-in component dựng sẵn trên Recharts), không cần đánh giá lib chart riêng |
| ~~`sonner`~~ | — | **Không cần** — shadcn/ui variant Base UI (07/2026) đã có Toast component native build thẳng trên Base UI Toast primitive (`shadcn add toast`, API `toast.add({...})`), không phải wrapper quanh sonner nữa. `sonner` chỉ cần nếu sau này đổi sang variant Radix của shadcn (doc Radix vẫn dùng sonner) — không phải lựa chọn của repo này |
| `react-colorful` | **5.6.1** | Color picker cho Inspector color swatch (FR-B-10 Typography/Box) — 2.8KB, không tự viết picker (HSV wheel, alpha slider... không đáng tự làm) |
| `libphonenumber-js` | **1.12.x** | Validate + chuẩn hoá SĐT VN về +84 (FR-D-02, `leads.phone` dedupe FR-E-06) — số VN có nhiều dạng nhập (0912..., +84912..., 84912...), tự viết regex dễ sai edge case đầu số |
| `qrcode` | **1.5.4** | Fallback tự render VietQR (EMVCo payload) khi không muốn phụ thuộc uptime/branding của `img.vietqr.io`. **Mặc định v1 vẫn dùng VietQR quick-link image API trực tiếp** (không cần lib) — chỉ thêm `qrcode` khi cần tự host/tuỳ biến |
| `@upstash/ratelimit` | **2.0.6** | Rate limit public endpoints (`/public/leads`, webhook — NFR-05) trên cùng Upstash Redis đã chọn cho cache; VPS phase đổi sang implement thủ công trên `ioredis` (sliding window, không cần lib mới) |
| `@inlang/paraglide-js` | **2.x** | i18n message catalog ICU (NFR-07) — biên dịch message thành hàm TS tại build time (zero runtime i18n lib, tree-shake theo locale dùng) thay vì `react-intl`/`i18next` runtime nặng hơn — hợp NFR-02 (TTI < 3s), vẫn hỗ trợ ICU plural/select đầy đủ cho tiếng Việt lẫn EN sau này |

### Backend (`apps/api`, `apps/edge-router`)

| Package | Version | Ghi chú |
| --- | --- | --- |
| `hono` | **4.13.2** | 2 entrypoints (Workers/Bun); RPC mode (`hc`) cho type-safe client nếu muốn thay REST thuần |
| `@hono/zod-validator` | **0.9.0** | Validate input bằng chính schema trong `contracts` |
| `better-auth` | **1.6.29** | + plugin `organization` (multi-tenant), `admin`; nhịp release rất nhanh — pin minor, đọc changelog khi bump |
| `drizzle-orm` / `drizzle-kit` | **0.45.2 / 0.31.10** | Vẫn 0.x nhưng là chuẩn de-facto production; generate+migrate trong CI |
| `@neondatabase/serverless` | **1.1.0** | Driver HTTP/WebSocket cho Workers; VPS phase đổi sang `postgres` (postgres.js **3.4.9**) — Drizzle đổi driver không đổi query |
| `zod` | 4.4.3 | (chung catalog) |
| `wrangler` | **4.123.0** | Deploy Workers + `wrangler types` (thay `@cloudflare/workers-types` cũ) |
| `ulid` | **3.0.2** | PK sortable |

### AI layer (`packages/ai-gateway`)

| Package | Version | Ghi chú |
| --- | --- | --- |
| `ai` | **7.0.66** | Core: `streamText`, `ToolLoopAgent`, tool approvals, telemetry |
| OpenRouter provider (`@openrouter/ai-sdk-provider`) | **3.0.0** | **Provider mặc định v1** (không phải "thứ 3" nữa — quyết định đổi theo FR-H-01/H-03): 1 key, truy cập DeepSeek/Qwen/Llama free hoặc rất rẻ để test trước khi trả tiền Anthropic/OpenAI trực tiếp. Prompt caching của Anthropic vẫn hoạt động khi gọi Claude qua OpenRouter (pass-through). Bản 3.0.0 yêu cầu `ai@^7.0.0` (khớp catalog `ai: 7.0.66` ở trên) và Node ≥ 22 |
| `@ai-sdk/anthropic` | **4.0.39** | Claude provider trực tiếp (prompt caching cho system prompt dài — giảm mạnh input cost); dùng khi org tự có key Anthropic thay vì qua OpenRouter |
| `@ai-sdk/openai` | **4.0.42** | OpenAI provider trực tiếp |

### Jobs, cache, storage, sanitize

| Package | Version | Giai đoạn |
| --- | --- | --- |
| `@upstash/redis` | **1.38.2** | Free tier: cache, session |
| `@upstash/ratelimit` | **2.0.6** | Rate limit public endpoints trên cùng Redis instance (NFR-05) — sliding window sẵn có, không tự viết |
| `@upstash/qstash` | **2.11.3** | Free tier: jobs driver 1 |
| `bullmq` | **6.1.1** | VPS: jobs driver 2 (v6 mới — check migration notes v5→v6 khi tới phase) |
| `ioredis` | **6.0.0** | VPS Redis client |
| `sanitize-html` | **2.17.7** | Sanitize HTML AI/import phía server (allowlist). `dompurify` 3.4.13 dự phòng phía client-preview |
| `linkedom` | **0.18.13** | Parse DOM server-side (Workers-compatible, nhẹ) cho srcmap hoá lúc import |
| `sharp` | **0.35.3** | Nén/convert AVIF-WebP assets (chạy trong job; Workers dùng Cloudflare Images API thay thế ở giai đoạn 1) |
| `@sentry/react` + `@sentry/cloudflare` | **10.x** | Error tracking |
| `resend` | **6.1.2** | Email giao dịch (FR-A-01 xác thực, FR-A-04 invite, FR-I-01..04): xác thực domain, HTTP API đơn giản, chạy tốt trên Workers (không cần SMTP long-lived connection — lý do chọn thay Nodemailer/SES SMTP) |

### Build packages nội bộ

| Package | Version | Ghi chú |
| --- | --- | --- |
| `tsdown` | **0.22.14** | Bundler cho compiled packages (`landing-runtime` IIFE, `studio-core` nếu publish) — rolldown-based, thay tsup (tsup đã ngừng phát triển tích cực). Cùng hệ Rust toolchain với Vite 8 |

## 2. Vì sao stack này tối ưu THỜI GIAN (câu hỏi chính của bạn)

| Quyết định | Thời gian tiết kiệm ước tính |
| --- | --- |
| AI Elements + AI SDK 7 `useChat`/`ToolLoopAgent` thay vì tự viết chat + agent loop | ~1.5–2 tuần |
| Better Auth plugin organization thay vì tự viết multi-tenant auth/invite/RBAC | ~1.5 tuần |
| shadcn/ui + Tailwind v4 + token strategy có sẵn của bạn | ~1 tuần |
| Drizzle + zod v4 + `contracts` dùng chung (không viết types 2 lần, không codegen OpenAPI) | ~0.5–1 tuần |
| TanStack Router search-params validation (CRM filters là URL state, không tự viết serializer) | ~2–3 ngày |
| React Compiler 1.0 (bỏ vòng lặp tối ưu memo thủ công trong studio) | ~2–3 ngày + bugs tránh được |
| Toolchain Rust (Oxlint/Oxfmt/Rolldown/tsc Go): CI ~vài chục giây thay vì 5–10 phút | Cộng dồn hàng giờ mỗi tuần, feedback loop nhanh |
| Bun catalogs | Hết loại bug "2 version zod trong monorepo" |

## 3. Version policy (kỷ luật để "luôn latest" mà không vỡ)

1. **Pin qua bun catalog/catalogs**, mọi package trong workspace dùng `"catalog:"` (nhóm mặc định) hoặc `"catalog:<group>"` (nhóm đặt tên: `react`, `ui`, `data`, `ai`, `server`, `db`, `queue`, `content`, `monitoring`) — nguồn duy nhất, khai báo trong `workspaces.catalog`/`workspaces.catalogs` của root `package.json`.
2. **Renovate bot** (free, self-hosted qua GitHub App): auto-PR theo nhóm (minor/patch gộp weekly, major tách riêng); merge khi CI xanh (đây là lý do đầu tư test từ Phase 0 — nó chính là cái cho phép bạn "luôn dùng latest" một cách an toàn).
3. Pre-1.0 packages (`oxfmt`, `drizzle-orm`, AI Elements): pin **exact**, bump có chủ đích đọc changelog.
4. Không dùng bleeding-edge kênh nightly (`@typescript/native-preview`, canary) trong main — chỉ để thử nghiệm nhánh riêng.
5. Mỗi quý: 1 buổi "dependency day" xử lý các major PR tồn đọng.

## 4. Caveats & bẫy đã biết (đọc trước khi code)

- **TS 7**: `node`/`node10` moduleResolution đã bị bỏ → dùng `bundler` (FE) và `nodenext` (packages). Deprecation 6.0 = hard error. Không dùng ts-morph/custom transformers cho tới 7.1.
- **Vite 8**: ESM-only; `rollupOptions` → `rolldownOptions`; plugin nào đụng internals Rollup/esbuild cần test (hầu hết plugin phổ biến đã compatible); block `esbuild` trong config thành `oxc`.
- **Zod 4**: import từ `"zod"` (v4 API); một số lib cũ còn peer-dep zod 3 — check khi thêm lib mới (Better Auth, Drizzle, AI SDK 7, hono zod-validator đều đã hỗ trợ v4).
- **Tailwind v4**: không còn `tailwind.config.js` mặc định — config bằng CSS `@theme`; shadcn components thế hệ mới đã theo chuẩn này.
- **AI SDK 7**: đổi naming so v5/v6 (nhiều bài viết cũ trên mạng là v4/v5 — đừng copy mù); `@ai-sdk/react` major version (4.x) không trùng số với `ai` (7.x) — là chủ đích, không phải cài nhầm.
- **BullMQ v6**: mới ra major — khi tới phase VPS, đọc migration notes; QStash driver là đường chạy trước nên không blocking.
- **lucide-react 1.x**: đã qua 0.x — API import giữ nguyên nhưng một số icon rename; dùng codemod của họ nếu port code cũ.
- **Better Auth 1.6.x**: release rất nhanh; schema DB của nó generate qua CLI — chạy lại generate sau mỗi lần bump minor để sync Drizzle schema.

## 5. Files cấu hình mẫu

```jsonc
// package.json (root) — Bun workspaces + catalogs
{
  "workspaces": {
    "packages": ["apps/*", "packages/*"],
    "catalog": {
      // nhóm mặc định: tooling cross-cutting dùng chung khắp repo
      "typescript": "7.0.2",
      "oxlint": "1.78.0", // pin exact nhóm pre-1.0/format
      "oxfmt": "0.63.0",
      "zod": "4.4.3"
    },
    "catalogs": {
      "react": {
        "react": "19.2.8",
        "react-dom": "19.2.8",
        "vite": "8.2.1",
        "@vitejs/plugin-react": "6.0.5",
        "tailwindcss": "4.3.3",
        "@dnd-kit/core": "6.3.1",
        "@dnd-kit/sortable": "10.0.0",
        "react-hook-form": "7.65.0",
        "@hookform/resolvers": "5.2.0",
        "recharts": "3.2.0",
        "react-colorful": "5.6.1",
        "@inlang/paraglide-js": "2.0.0"
      },
      "content": {
        "streamdown": "2.5.0",
        "libphonenumber-js": "1.12.0",
        "qrcode": "1.5.4"
      },
      "data": {
        "@tanstack/react-router": "1.170.29",
        "@tanstack/react-query": "5.101.4"
      },
      "queue": {
        "@upstash/redis": "1.38.2",
        "@upstash/qstash": "2.11.3",
        "@upstash/ratelimit": "2.0.6"
      },
      "ai": {
        "ai": "7.0.66",
        "@ai-sdk/react": "4.0.69",
        "@openrouter/ai-sdk-provider": "3.0.0",
        "@ai-sdk/anthropic": "4.0.39",
        "@ai-sdk/openai": "4.0.42"
      },
      "server": {
        "hono": "4.13.2",
        "better-auth": "1.6.29",
        "tsdown": "0.22.14",
        "resend": "6.1.2"
      },
      "db": {
        "drizzle-orm": "0.45.2"
      }
    }
  }
}
```

```jsonc
// tsconfig.base.json (packages/config)
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "bundler", // FE/packages bundle; api VPS build: nodenext
    "strict": true, // default của TS7, ghi tường minh
    "verbatimModuleSyntax": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true
  }
}
```

```jsonc
// package.json (root) — scripts chính
{
  "engines": { "node": ">=22.12", "bun": ">=1.3" },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "typecheck": "turbo run typecheck", // tsc --noEmit (Go-native, --checkers auto)
    "lint": "oxlint --type-aware .",
    "fmt": "oxfmt .",
    "test": "turbo run test",
    "e2e": "playwright test"
  }
}
```

```ts
// vite.config.ts (apps/dashboard) — React Compiler bật
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react({ babel: reactCompilerPreset() }), tailwindcss()],
  build: { target: "baseline-widely-available" }
});
```

## 6. Những thứ CỐ TÌNH không đưa vào (và lý do)

- **Next.js 16.3** — đã phân tích ở architecture.md: dashboard sau login không cần SSR/SEO; Vite SPA rẻ hơn về vận hành và migrate. Next chỉ quay lại nếu làm site marketing riêng.
- **TanStack Start** — hấp dẫn nhưng thêm một meta-framework là thêm surface area; SPA + Router đủ cho dashboard. Đánh giá lại khi Start chín hơn và nếu cần SSR thật.
- **tRPC** — Hono RPC + zod contracts đã cho type-safety tương đương với ít tầng hơn, và public endpoints (form landing) vẫn cần REST thuần.
- **NestJS/Express** — nặng, không chạy edge.
- **Prisma** — engine nặng hơn trên serverless; Drizzle sát SQL, migration minh bạch, bạn đã quen.
- **Biome** — tốt, nhưng Oxlint/Oxfmt cùng hệ Oxc với Vite 8/tsdown → một toolchain nhất quán.
- **LangChain/LlamaIndex** — AI SDK 7 + patch protocol tự định nghĩa là đủ và kiểm soát được; framework agent nặng chỉ thêm độ trễ debug.
- **Kafka/NATS, Kubernetes** — quy mô này là over-engineering; Dokploy + docker compose đúng cỡ.
