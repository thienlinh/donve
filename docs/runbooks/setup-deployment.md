# Setup, Deployment & Vận hành — runbook gộp

Đây là runbook thao tác cho local, CI/CD, secrets và hạ tầng. Đọc [`docs/architecture/architecture.md`](../architecture/architecture.md) cho lý do thiết kế.

## 1. Local dev setup

```bash
docker-compose up -d          # postgres:18-alpine + valkey/valkey:latest (redis-protocol compatible)
```

- Postgres 18 image mount ở `/var/lib/postgresql` (không phải `/var/lib/postgresql/data` như bản 17) — đã đúng trong `docker-compose.yml`, đừng tự thêm `/data` khi sửa volume.
- Redis local là **Valkey** (drop-in, redis-cli/valkey-cli tương thích). Upstash (managed, dùng cho path CF Workers) **không đổi** — vẫn là Redis-protocol SaaS, không liên quan tới Valkey.
- PK các bảng nghiệp vụ giờ là Postgres 18 `uuidv7()` (uuid column), không còn ULID text.

`.env` cần các biến sau (xem `apps/api/src/types.ts` `Bindings` cho danh sách đầy đủ):

```
DATABASE_URL=postgres://donve:donve@localhost:5432/donve
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=...
APP_URL=...
PORT=...
UPSTASH_REDIS_URL=...        # để trống local nếu dùng valkey qua ioredis driver
UPSTASH_REDIS_TOKEN=...
RESEND_API_KEY=...
LOCAL_STORAGE_DIR=...
```

Migrate + seed:

```bash
cd packages/db
bun run db:generate   # sau khi sửa schema/*.ts — đọc lại SQL sinh ra trước khi migrate (drop/rename giả)
bun run db:migrate    # áp migrations/*.sql
bun run db:seed       # demo org + platform skills
```

Kết nối nhanh: `psql $DATABASE_URL` — role `donve` là superuser, **bypass RLS**, chỉ dùng để xem dữ liệu thô, không dùng để verify phân quyền. Verify RLS thật:

```bash
cd packages/db && bun test test/org-scope.integration.test.ts   # cần Docker chạy (testcontainers)
```

Mọi query phải qua `withOrgScope`/`createOrgScopedRepository` (`packages/db/src/org-scope.ts`) — `build` chỉ chứa **đúng 1 câu query** (neon-http không có transaction thật, chỉ `.batch()`). Multi-statement atomic → viết helper riêng, không ép vào `withOrgScope`.

## 2. CI/CD — setup một lần (thủ công, không qua code)

**Turbo remote cache (free, Vercel):**

```bash
bunx turbo login && bunx turbo link
cat .turbo/config.json   # lấy teamId
```

GitHub repo → Secrets: `TURBO_TOKEN` (từ vercel.com/account/tokens); Variables: `TURBO_TEAM`. Không set vẫn chạy được, chỉ mất cache chia sẻ giữa run.

**GitHub Environments** (Settings → Environments), không tạo `dev`:

- `staging` — không cần protection, auto-deploy sau CI xanh trên `main`.
- `prod` — bật **Required reviewers**, chỉ gate cho `deploy-prod.yml` (workflow_dispatch), không liên quan tới secret (secret không đi qua GitHub, xem §4).

**Repo-level secrets** (GitHub UI, dùng cho chính pipeline xác thực):

- `CLOUDFLARE_API_TOKEN` (quyền `Workers Scripts:Edit`, `Cloudflare Pages:Edit`, `Account Settings:Read`), `CLOUDFLARE_ACCOUNT_ID`, `TURBO_TOKEN`.

**Neon staging branch**: tạo branch `staging` trong Neon console (feature "branching") → connection string dùng cho `DATABASE_URL` env `staging`. `prod` dùng thẳng branch chính, không tạo branch riêng.

**CF Pages** — 2 project riêng, domain/build history tách biệt:

```bash
cd apps/donve
bunx wrangler pages project create dv-donve-staging --production-branch=main
bunx wrangler pages project create dv-donve --production-branch=main
```

**Custom domain** (khi đã chốt tên miền — hiện `donve.vn` chỉ là placeholder):

1. Add domain vào Cloudflare.
2. Workers `dv-api`/`dv-api-staging` → Domains & Routes → add `api.donve.vn`/`api-staging.donve.vn`.
3. Pages `dv-donve`/`dv-donve-staging` → Custom domains → add `app.donve.vn`/`app-staging.donve.vn`.
4. Domain cụ thể tự ưu tiên hơn route wildcard `*.donve.vn` của `edge-router`, không cần cấu hình loại trừ.
5. Đổi domain khác → sửa `vars.BETTER_AUTH_URL`/`APP_URL` trong `apps/api/wrangler.jsonc` + `VITE_API_URL` trong 2 workflow deploy.

**Lighthouse CI gate (NFR-01)** — chỉ chạy khi có variable `SAMPLE_LANDING_URL` (repo-level, Actions → Variables): publish 1 landing thật lên staging, lấy hostname, set biến. Fail nếu Perf/SEO/BP/A11y < 95 mobile, LCP ≥ 1.8s, hoặc `landing-runtime` build > 10KB gzip. Giữ landing mẫu ổn định (không unpublish).

**Verify sau khi làm xong 1-5**: push commit nhỏ lên `main` → CI xanh → Deploy Staging tự chạy → check `api-staging.../api/auth/*` trả response thật. Chạy `deploy-prod.yml` tay (Actions → Run workflow) → phải dừng chờ approve. Migration DB tự chạy trong cả 2 workflow. Cấp quyền `/platform` (platform-admin) **không** tự động — chạy tay 1 lệnh CLI mỗi env mới, xem `docs/architecture/platform-admin.md` §9.

## 3. Secret management — 9 secret/env, set thẳng vào Cloudflare

```bash
cd apps/api
wrangler secret put DATABASE_URL --env staging
wrangler secret put BETTER_AUTH_SECRET --env staging
wrangler secret put UPSTASH_REDIS_URL --env staging
wrangler secret put UPSTASH_REDIS_TOKEN --env staging
wrangler secret put RESEND_API_KEY --env staging
wrangler secret put AI_KEY_MASTER_SECRET --env staging       # 1 lần, xem cảnh báo dưới
wrangler secret put PAYMENTS_KEY_MASTER_SECRET --env staging # 1 lần, xem cảnh báo dưới
wrangler secret put TURNSTILE_SECRET_KEY --env staging
wrangler secret put PLATFORM_OPENROUTER_API_KEY --env staging
gh secret set DATABASE_URL --env staging   # ngoại lệ: CI migration cần giá trị này ở GitHub Environment secret riêng
```

Lặp lại `--env production` với giá trị khác (Neon branch chính, key riêng). Optional (bỏ trống nếu chưa dùng feature): `CF_API_TOKEN`, `CF_ZONE_ID`, `UNSPLASH_ACCESS_KEY`, `PEXELS_API_KEY`.

- **Không có `.env.staging`/`.env.production`** local, không CI job nào sync secret — mọi thay đổi đi thẳng `wrangler secret put`, có chủ đích (tránh 1 hop write-only thừa). Đánh đổi: prod "Required reviewers" chỉ gate deploy, không gate đổi secret; không có nơi backup giá trị (Cloudflare secret **write-only**, kể cả `wrangler secret list` chỉ ra tên). **Tự lưu giá trị vào password manager trước khi `put`**, không có lưới an toàn khác.
- **Master key** (`AI_KEY_MASTER_SECRET`/`PAYMENTS_KEY_MASTER_SECRET`): đổi giá trị = khoá vĩnh viễn dữ liệu BYOK/payment cũ (không giải mã lại được). Chỉ generate mới khi **chưa từng deploy** env đó. Env đã có rồi → không đổi trừ khi đã chạy xong job re-encrypt (chưa implement).
- Onboard dev mới: `cp apps/api/.env.example apps/api/.env.local`, điền `DATABASE_URL`, `BETTER_AUTH_SECRET`, `AI_KEY_MASTER_SECRET`, `PAYMENTS_KEY_MASTER_SECRET` (bun.ts crash lúc boot nếu thiếu 4 biến này), còn lại để trống — feature liên quan tự degrade.
- Thêm biến mới: field vào `Bindings` (`apps/api/src/types.ts`) → đọc trong `bun.ts` → secret thì `wrangler secret put` cả 2 env + `.env.example`; non-secret tĩnh thì thẳng vào `wrangler.jsonc` `vars`.

## 4. Deploy flow

- `staging`: merge vào `main` → CI xanh → `deploy-staging.yml` tự chạy (wrangler deploy api + edge-router, CF Pages DonVe app, DB migration tự động).
- `prod`: `deploy-prod.yml` (workflow_dispatch) → chờ approve `Required reviewers` → chạy.
- Rollback: trỏ lại deployment/DNS trước đó (Workers giữ deployment cũ, KV con trỏ đổi tức thời).

## 5. Infra & cost — free tier → VPS

Hybrid theo bản chất workload, không "all-in" 1 bên:

| Workload | Giai đoạn 1 (free) | Giai đoạn 2 |
| --- | --- | --- |
| Landing serving (edge-router+R2+KV) | Cloudflare edge | giữ nguyên, mãi mãi |
| DonVe app SPA | CF Pages | giữ nguyên |
| API (Hono) | CF Workers (100k req/ngày free) | VPS VN Bun khi cần job dài/Playwright/BullMQ |
| Postgres | Neon free 0.5GB | self-host VPS + pgBackRest |
| Redis/Jobs | Upstash + QStash | Valkey/Redis + BullMQ trên VPS |
| Assets | R2 (10GB free, egress $0) | giữ nguyên |

Tổng chi phí giai đoạn 1 ≈ 0đ/tháng (chỉ tên miền). Ngưỡng chuyển giai đoạn 2: Workers > 70k req/ngày, Neon > 0.4GB, hoặc cần Playwright thumbnail server-side ổn định.

VPS đề xuất: 4 vCPU/8GB/100GB NVMe VN, ~300–600k VND/tháng, quản lý bằng Dokploy (docker-compose api+worker+postgres+valkey, Cloudflare vẫn đứng trước `api.` proxy/WAF). Migration = đổi env (`JOBS_DRIVER=bullmq`, `CACHE_DRIVER=ioredis`, `DATABASE_URL` local) + `pg_dump`/restore, không refactor code — vì `packages/drivers` đã trừu tượng hoá cache/jobs/storage. Rollback = trỏ DNS lại Workers (giữ deployment 30 ngày).

`pageVersions`/R2 retention: không bao giờ prune version đang publish hoặc có label; version trung gian AI-patch giữ 50 gần nhất, xoá nếu > 90 ngày (job P1, chưa block v1).
