# CI/CD — setup thủ công một lần

Đi kèm `docs/ops/infra-deployment-cost.md` §6 (nguồn quyết định) và các workflow trong `.github/workflows/`. File này liệt kê phần **không thể làm qua code** — tạo tài khoản/project/secret ở Cloudflare, Neon, Vercel, GitHub — phải làm tay một lần trước khi CI/CD chạy được thật. Sau khi làm xong, tick lại checkbox tương ứng ở `docs/runbooks/prompt-playbook.md` Phase 0.

## 1. Turbo remote cache (free — Vercel)

`--affected` chỉ tiết kiệm CI time nếu cache có thể chia sẻ giữa các lần chạy/PR khác nhau. Không cần R2-backed tự dựng (phải có VPS/server để host, mà Phase 0 chưa mua) — dùng remote cache free có sẵn của Vercel:

```bash
bunx turbo login     # mở browser, đăng nhập/tạo tài khoản Vercel free
bunx turbo link       # chọn/tạo team, link repo hiện tại
cat .turbo/config.json   # lấy "teamId"/"apiUrl" — teamId chính là TURBO_TEAM
```

Tạo token tại https://vercel.com/account/tokens → thêm vào GitHub repo:

- **Settings → Secrets and variables → Actions → Secrets**: `TURBO_TOKEN`
- **Settings → Secrets and variables → Actions → Variables**: `TURBO_TEAM` (giá trị `teamId` ở trên)

Không set cũng không sao — `ci.yml` fallback về cache local, chỉ là không chia sẻ được giữa các run.

## 2. GitHub Environments

Tạo 2 environment ở **Settings → Environments** (không tạo `dev` — dev là docker-compose thuần local, không đụng GitHub):

- **`staging`** — không cần protection rule (auto-deploy sau khi CI xanh trên `main`, đúng thiết kế).
- **`prod`** — bật **Required reviewers** (ít nhất chính bạn) để `deploy-prod.yml` (`workflow_dispatch`) phải chờ approve thủ công trước khi chạy — đây là gate thật, không phải cosmetic.

Mỗi environment cần 9 secret sau set thẳng vào Cloudflare bằng `wrangler secret put <KEY> --env <env>` (giá trị **khác nhau** giữa staging/prod — staging trỏ Neon branch riêng, prod trỏ Neon branch chính). Đây **không phải** GitHub Environment secret (trừ `DATABASE_URL`, xem ngoại lệ ở `env-management.md` §2) — chi tiết đầy đủ + lý do thiết kế ở `docs/runbooks/env-management.md`.

| Secret | Bắt buộc | Nguồn giá trị |
| --- | --- | --- |
| `DATABASE_URL` | có | Neon: staging = branch riêng (Neon "branching" feature), prod = branch chính |
| `BETTER_AUTH_SECRET` | có | `openssl rand -hex 32` — khác giá trị giữa staging/prod |
| `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN` | có | Upstash console — có thể dùng chung 1 Upstash DB cho cả 2 env ở giai đoạn free tier này (tách riêng khi cần) |
| `RESEND_API_KEY` | có | Resend dashboard — domain `mail.donve.vn` phải verify SPF/DKIM/DMARC trước khi gửi thật |
| `AI_KEY_MASTER_SECRET`, `PAYMENTS_KEY_MASTER_SECRET` | có | Master key mã hoá BYOK/payment connection (`packages/ai-gateway`) — generate 1 lần, **không đổi sau đó** trừ khi chạy job re-encrypt (xem `env-management.md` §3, chưa implement) |
| `TURNSTILE_SECRET_KEY` | có | Cloudflare Turnstile dashboard, widget riêng cho zone `donve.vn` |
| `PLATFORM_OPENROUTER_API_KEY` | có | OpenRouter — key của platform dùng cho no-BYOK trial (FR-H-02) |
| `CF_API_TOKEN`, `CF_ZONE_ID` | không | FR-G-04 custom domain (Cloudflare for SaaS) — bỏ trống nếu chưa làm tính năng này |
| `UNSPLASH_ACCESS_KEY`, `PEXELS_API_KEY` | không | FR-B-32/33 stock photo — bỏ trống thì feature tự degrade |

Ngoài ra 3 secret **repo-level** (không thuộc riêng environment nào, dùng chung cho cả `deploy-staging.yml`/`deploy-prod.yml`, set tay qua GitHub UI — không qua `env:push` vì đây là thứ tự xác thực cho chính pipeline):

- `CLOUDFLARE_API_TOKEN` — tạo ở CF dashboard → My Profile → API Tokens → Create Token, quyền tối thiểu: `Workers Scripts:Edit`, `Cloudflare Pages:Edit`, `Account Settings:Read` (scope theo account đang dùng).
- `CLOUDFLARE_ACCOUNT_ID` — CF dashboard, góc phải trang tổng quan account.
- `TURBO_TOKEN` (§1 ở trên).

> Các secret ở trên set thẳng vào Worker bằng `wrangler secret put`/`wrangler secret bulk` chạy tay — không đi qua GitHub Environment, không có bước CI nào đồng bộ. Ngoại lệ: `DATABASE_URL` còn phải set thêm 1 lần nữa làm GitHub Environment secret riêng vì bước migrate DB chạy trong CI cần nó (xem `env-management.md` §2).

## 3. Neon — staging branch

Neon "branching": tạo 1 branch riêng tên `staging` từ branch chính trong Neon console → copy connection string → dùng làm `DATABASE_URL` secret của GitHub environment `staging` ở trên. Không tạo branch cho `prod` — dùng trực tiếp branch chính (`main`) của Neon project.

## 4. Cloudflare Pages — 2 project riêng cho dashboard

Tạo 2 CF Pages project (không share 1 project giữa staging/prod, để domain + build history tách biệt rõ):

```bash
cd apps/dashboard
bunx wrangler pages project create dv-dashboard-staging --production-branch=main
bunx wrangler pages project create dv-dashboard --production-branch=main
```

`deploy-staging.yml`/`deploy-prod.yml` deploy vào đúng project theo `--project-name` đã hard-code trong workflow — không cần cấu hình gì thêm ở CF dashboard ngoài việc gán custom domain (bước 5).

## 5. Custom domain (khi đã chốt tên miền)

`docs/runbooks/prompt-playbook.md` mục "Việc không phải prompt code" còn để mở "Chốt tên miền nền tảng" — domain `donve.vn` mới là working placeholder xuyên suốt docs, chưa phải quyết định cuối. Khi chốt xong:

1. Add domain `donve.vn` vào Cloudflare (nếu chưa).
2. CF dashboard → Workers & Pages → `dv-api` / `dv-api-staging` → Settings → Domains & Routes → Add Custom Domain: `api.donve.vn` / `api-staging.donve.vn`.
3. CF dashboard → `dv-dashboard` / `dv-dashboard-staging` → Custom domains → Add: `app.donve.vn` / `app-staging.donve.vn`.
4. Domain cụ thể (`api.*`, `app.*`) tự động ưu tiên hơn route wildcard `*.donve.vn` của `edge-router` (Phase 3) — Cloudflare match route cụ thể trước route wildcard, không cần cấu hình loại trừ riêng.
5. Nếu đổi domain khác `donve.vn`, sửa lại `vars.BETTER_AUTH_URL`/`vars.DASHBOARD_URL` trong `apps/api/wrangler.jsonc` (env `staging`/`production`) và `VITE_API_URL` trong 2 workflow deploy tương ứng.

## 6. Xác nhận CI/CD chạy đúng (sau khi làm xong 1-5)

1. Push 1 commit nhỏ lên `main` → workflow `CI` phải xanh, workflow `Deploy Staging` tự chạy sau đó (xem tab Actions, phụ thuộc `workflow_run`) → API + Dashboard staging cập nhật.
2. Kiểm tra `https://api-staging.donve.vn/api/auth/*` (hoặc URL `*.workers.dev` nếu chưa gán domain) trả response thật, không lỗi DB connection.
3. Chạy `deploy-prod.yml` bằng tay (Actions tab → Deploy Production → Run workflow) → phải dừng chờ approve ở bước environment `prod` trước khi chạy job.

> Migration DB (`drizzle-kit migrate`) đã tự chạy trong cả 2 workflow trên — không cần làm tay. Riêng cấp quyền `/platform` (platform-admin) thì **không** tự động — mỗi environment mới deploy xong phải tự chạy 1 lệnh CLI, xem `docs/architecture/platform-admin.md` §9.

## 7. Lighthouse CI gate (NFR-01) — cần 1 landing mẫu đã publish

`tooling/lighthouse-ci/run.ts` đã implement và có bước gọi trong `deploy-staging.yml`, nhưng bước đó chỉ chạy khi biến `SAMPLE_LANDING_URL` tồn tại — chưa set thì gate bị skip (không fail workflow), vì repo hiện chưa có script seed publish sẵn 1 landing mẫu.

1. Tự publish 1 landing thật lên staging (qua dashboard hoặc gọi `POST /:id/publish`), lấy hostname `*.donve.vn` (hoặc domain tạm) của deployment đó.
2. **Settings → Secrets and variables → Actions → Variables** (repo-level, không phải riêng environment): thêm `SAMPLE_LANDING_URL` = URL đầy đủ của landing mẫu đó.
3. Chạy lại workflow — bước "Lighthouse CI gate (NFR-01, sample landing)" giờ chạy thật; fail nếu Performance/SEO/Best Practices/A11y < 95 (mobile), LCP ≥ 1.8s, hoặc `apps/landing-runtime` build ra > 10KB gzip.

Landing mẫu này cần giữ ổn định (không xoá/unpublish) để gate không đột nhiên mất mục tiêu — đổi landing mẫu thì cập nhật lại biến trên.
