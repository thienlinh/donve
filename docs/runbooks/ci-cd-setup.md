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

Mỗi environment cần các secret sau (giá trị **khác nhau** giữa staging/prod — staging trỏ Neon branch riêng, prod trỏ Neon branch chính):

| Secret | Nguồn |
| --- | --- |
| `DATABASE_URL` | Neon: staging = branch riêng (Neon "branching" feature), prod = branch chính |
| `BETTER_AUTH_SECRET` | `openssl rand -hex 32` — khác giá trị giữa staging/prod |
| `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN` | Upstash console — có thể dùng chung 1 Upstash DB cho cả 2 env ở giai đoạn free tier này (tách riêng khi cần) |
| `RESEND_API_KEY` | Resend dashboard — domain `mail.donve.vn` phải verify SPF/DKIM/DMARC trước khi gửi thật |

Ngoài ra 2 secret **repo-level** (không thuộc riêng environment nào, dùng chung cho cả `deploy-staging.yml`/`deploy-prod.yml`):

- `CLOUDFLARE_API_TOKEN` — tạo ở CF dashboard → My Profile → API Tokens → Create Token, quyền tối thiểu: `Workers Scripts:Edit`, `Cloudflare Pages:Edit`, `Account Settings:Read` (scope theo account đang dùng).
- `CLOUDFLARE_ACCOUNT_ID` — CF dashboard, góc phải trang tổng quan account.

> Secret nào có ở GitHub Environment cũng cần đồng thời tồn tại như **Wrangler secret** ở Worker thật (`wrangler secret put NAME --env staging`) — `deploy-staging.yml`/`deploy-prod.yml` đã tự động sync việc này mỗi lần deploy (bước "Sync Worker secrets"), không cần chạy `wrangler secret put` tay ngoài lần đầu set giá trị GitHub secret.

`masterKey` mã hoá BYOK (nhắc ở infra-deployment-cost.md §6) **chưa cần** ở bước này — `packages/ai-gateway` (key vault) là việc Phase 2, chưa tồn tại. Khi Phase 2 làm xong, thêm secret riêng (vd `BYOK_MASTER_KEY`) theo đúng nguyên tắc "tách riêng, rotate được" — không gộp chung với secret khác.

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
