# Env & secret management — runbook

Đi kèm `docs/runbooks/ci-cd-setup.md` (setup thủ công một lần) và `docs/ops/infra-deployment-cost.md` §3 (VPS/Dokploy giai đoạn 2). File này trả lời: **có bao nhiêu biến, biến nào ở đâu, đổi 1 secret thì làm gì, và vì sao lại thiết kế thế này** — đọc trước khi đụng vào bất kỳ secret nào của `apps/api`.

## 1. Nguyên tắc: Cloudflare là nguồn thật duy nhất cho secret của Worker

```
wrangler secret put <KEY> --env <staging|production>   (chạy tay từ máy dev, khi cần thêm/đổi)
        ▼
Cloudflare Worker secret (write-only — không đọc lại được giá trị đang chạy)
```

- **Không** có file `.env.staging`/`.env.production` nào ở local, và **không** có bước CI nào đồng bộ secret lên Cloudflare — mọi thay đổi secret của Worker đi thẳng bằng `wrangler secret put`/`wrangler secret bulk` chạy tay. Đây là lựa chọn có chủ đích: toàn bộ app deploy lên Cloudflare, nên quản secret ngay tại Cloudflare thay vì qua một lớp GitHub Environment trung gian.
- Vì Cloudflare secret **write-only** (không đọc lại được giá trị đang chạy, kể cả qua dashboard hay `wrangler secret list` — lệnh đó chỉ liệt kê **tên**, không bao giờ hiện giá trị), **không có cách nào backup/khôi phục** một giá trị đã set nếu bạn không tự lưu nó ở nơi khác (password manager, ghi chú riêng...). Đổi lại sự đơn giản này, kỷ luật cần giữ: **luôn tự lưu giá trị bạn vừa set ở đâu đó ngoài Cloudflare** trước khi `wrangler secret put`, vì sau đó không lấy lại được nữa.
- `.env.local` (gitignored, Bun tự đọc) vẫn là file duy nhất còn lại — chỉ phục vụ **local dev** (`RUNTIME=bun`), không liên quan gì tới staging/production.

## 2. Toàn bộ biến — phân loại

Đối chiếu `apps/api/src/types.ts` (`Bindings`).

| Biến | Loại | Bắt buộc? | Nguồn (staging/prod) | Nguồn (local dev) |
| --- | --- | --- | --- | --- |
| `RUNTIME`, `BETTER_AUTH_URL`, `DASHBOARD_URL`, `PUBLISH_BASE_DOMAIN`, `TURNSTILE_SITE_KEY`, `FOUNDER_ALERT_EMAIL`, `CF_CUSTOM_DOMAIN_TARGET` | non-secret | có (trừ `FOUNDER_ALERT_EMAIL`, `CF_CUSTOM_DOMAIN_TARGET` optional) | `wrangler.jsonc` `vars`, mỗi `env` block riêng (đã commit git) | `.env.local` |
| `DATABASE_URL`, `BETTER_AUTH_SECRET`, `UPSTASH_REDIS_URL`, `UPSTASH_REDIS_TOKEN`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `PLATFORM_OPENROUTER_API_KEY` | **secret**, đổi được tự do | có | `wrangler secret put <KEY> --env <env>` | `.env.local` |
| `AI_KEY_MASTER_SECRET`, `PAYMENTS_KEY_MASTER_SECRET` | **secret, master key** — xem §3 | có | `wrangler secret put` (rất hiếm khi đổi lại) | `.env.local` |
| `CF_API_TOKEN`, `CF_ZONE_ID`, `UNSPLASH_ACCESS_KEY`, `PEXELS_API_KEY` | secret, optional | không | `wrangler secret put` (bỏ qua nếu không dùng feature liên quan) | `.env.local` (thường để trống) |
| `PORT`, `LOCAL_STORAGE_DIR`, `LOCAL_DEPLOYMENTS_DIR` | non-secret, chỉ Bun/VPS | không | không dùng trên CF Workers | `.env.local` |
| `LANDING_ASSETS_BUCKET`, `DEPLOYMENTS_BUCKET`, `HOSTNAME_KV`, `AI` | CF Workers binding (không phải string) | không (chỉ có khi `RUNTIME=workers`) | `wrangler.jsonc` `r2_buckets`/`kv_namespaces`/`ai` | không áp dụng |

**Ngoại lệ quan trọng — `DATABASE_URL` sống ở 2 nơi cùng lúc:** ngoài việc là Worker secret ở trên, CI (`deploy-staging.yml`/`deploy-prod.yml`) còn cần chính giá trị này làm **GitHub Environment secret** riêng, vì bước "Run DB migrations" (`drizzle-kit migrate`) chạy trong GitHub Actions, không phải trong Worker. Đây là secret **duy nhất** phải set tay ở cả 2 chỗ và tự giữ khớp nhau khi đổi:

```bash
gh secret set DATABASE_URL --env staging      # cho bước migrate trong CI
wrangler secret put DATABASE_URL --env staging  # cho chính Worker (trong apps/api)
```

`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `TURBO_TOKEN` (+ `TURBO_TEAM` là Variable) **không** nằm trong `Bindings` — đây là secret cấp **repo** (không riêng environment), set 1 lần qua GitHub UI, dùng để chính CI xác thực với Cloudflare/Turborepo. Không đổi trong task này.

## 3. Master key — quy tắc riêng, đọc kỹ trước khi đổi

`AI_KEY_MASTER_SECRET`/`PAYMENTS_KEY_MASTER_SECRET` là khoá AES-256-GCM bọc `aiConnections.encryptedKey`/`paymentConnections.encryptedApiKey`. Đặc điểm khác biệt: **đổi giá trị không phải "cập nhật", mà là "khoá vĩnh viễn dữ liệu cũ"** — mọi row đã encrypt bằng key cũ không giải mã lại được bằng key mới.

Quy trình an toàn khi cần đổi:

1. `bunx wrangler secret list --env <env>` (trong `apps/api`) — xem key đã tồn tại trên Cloudflare chưa (chỉ thấy tên, không thấy giá trị).
2. Nếu **chưa từng deploy** cho env đó (lần đầu setup) → an toàn, generate mới bằng `bun -e "console.log(Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url'))"`, rồi `wrangler secret put AI_KEY_MASTER_SECRET --env <env>`.
3. Nếu **đã có** → **không đổi** trừ khi đã chạy xong 1 job re-encrypt lại toàn bộ row hiện có bằng key mới trước (job này chưa được implement — xem TODO ở `docs/ops/infra-deployment-cost.md` §6). Không có job đó, đổi key = mất quyền truy cập mọi BYOK/payment connection hiện tại của khách hàng thật.

## 4. Bootstrap 1 lần (khi setup repo mới hoặc máy dev mới)

```bash
brew install gh          # hoặc cách cài khác, xem cli.github.com
gh auth login            # đăng nhập 1 lần, lưu credential local
bunx wrangler login      # trong apps/api — xác thực để chạy `wrangler secret put` từ máy dev
```

Set 3 secret **repo-level** tại **Settings → Secrets and variables → Actions → Secrets** trên GitHub:

- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` — xem `docs/runbooks/ci-cd-setup.md` §2.
- `TURBO_TOKEN` (+ `TURBO_TEAM` là **Variable**) — xem `ci-cd-setup.md` §1.

Tạo 2 GitHub Environment (`staging`, `prod`) nếu chưa có (prod cần bật "Required reviewers" — gate này chỉ áp dụng cho _deploy_, không còn liên quan gì tới secret nữa vì secret không đi qua GitHub).

Set toàn bộ secret bắt buộc ở §2 cho từng env, ví dụ staging:

```bash
cd apps/api
wrangler secret put DATABASE_URL --env staging
wrangler secret put BETTER_AUTH_SECRET --env staging
wrangler secret put UPSTASH_REDIS_URL --env staging
wrangler secret put UPSTASH_REDIS_TOKEN --env staging
wrangler secret put RESEND_API_KEY --env staging
wrangler secret put AI_KEY_MASTER_SECRET --env staging
wrangler secret put PAYMENTS_KEY_MASTER_SECRET --env staging
wrangler secret put TURNSTILE_SECRET_KEY --env staging
wrangler secret put PLATFORM_OPENROUTER_API_KEY --env staging
gh secret set DATABASE_URL --env staging   # riêng biến này, thêm cho GitHub (CI migration)
```

Lặp lại với `--env production` và giá trị khác (Neon branch chính, key riêng...). Nguồn lấy từng giá trị: `docs/runbooks/ci-cd-setup.md` §2.

## 5. Việc thường làm

**Thêm/đổi 1 secret (ví dụ rotate `RESEND_API_KEY` sau khi lộ key cũ):**

```bash
cd apps/api
wrangler secret put RESEND_API_KEY --env staging     # nhập giá trị mới khi được hỏi
```

Không cần deploy lại — secret có hiệu lực ngay cho request tiếp theo. Chỉ khi đổi `DATABASE_URL` mới cần thêm bước `gh secret set DATABASE_URL --env staging` để CI migration lần deploy sau vẫn đúng.

**Thêm 1 biến hoàn toàn mới** (ví dụ tích hợp thêm 1 API bên thứ 3):

1. Thêm field vào `Bindings` trong `apps/api/src/types.ts` (comment giải thích, optional `?` nếu feature degrade được).
2. Đọc `process.env.TÊN_BIẾN` trong `apps/api/src/bun.ts`.
3. Nếu là **secret**: `wrangler secret put TÊN_BIẾN --env staging` và `--env production`, cập nhật comment trong `wrangler.jsonc`, thêm vào `apps/api/.env.example` + `.env.local`.
4. Nếu là **non-secret, tĩnh theo môi trường**: thêm thẳng vào `wrangler.jsonc` `vars` (mỗi `env` block), không cần secret.

**Onboard dev mới:**

```bash
cp apps/api/.env.example apps/api/.env.local
# điền DATABASE_URL, BETTER_AUTH_SECRET, AI_KEY_MASTER_SECRET, PAYMENTS_KEY_MASTER_SECRET
# (4 biến này bắt buộc — bun.ts crash ngay lúc boot nếu thiếu, xem requiredBindingsSchema
# trong apps/api/src/types.ts). Còn lại để trống, feature liên quan tự degrade.
```

## 6. Vì sao thiết kế thế này (không dùng GitHub Environment secret làm trung gian)

- Toàn bộ app deploy lên Cloudflare — không có nhánh VPS/Dokploy nào chạy song song hiện tại — nên một lớp GitHub Environment secret trung gian chỉ thêm 1 hop không cần thiết (2 write-only store thay vì 1) mà không đổi lại được gì về bảo mật, vì cả 2 phía đều write-only như nhau.
- Cái mất khi bỏ lớp GitHub: không còn "Required reviewers" của `prod` che chắn việc đổi secret — chỉ còn che chắn việc **deploy**. Đổi secret trực tiếp bằng `wrangler secret put` bất kỳ lúc nào có `CLOUDFLARE_API_TOKEN` hợp lệ, không cần approve. Chấp nhận đánh đổi này vì team nhỏ, người chạy lệnh cũng là người có quyền approve.
- Cái mất thứ hai: không còn file `.env.staging`/`.env.production` làm bản ghi "đã set những gì, giá trị gần đúng ra sao" trên máy dev (dù cũng đã write-only, ít nhất từng có 1 bản sao cục bộ để tham chiếu/backup). Giờ **hoàn toàn không có nơi nào phục hồi được giá trị** một khi mất — tự backup ở nơi khác (password manager) trước khi `wrangler secret put` là kỷ luật bắt buộc, không có lưới an toàn nào khác.

## 7. Khi lên VPS (Dokploy) — chưa làm bây giờ, nhưng chuẩn bị sẵn chỗ

Theo `docs/ops/infra-deployment-cost.md` §3, phase VPS thay `CACHE_DRIVER`/`JOBS_DRIVER` sang `ioredis`/`bullmq` — cần 1 biến mới (`REDIS_URL`) khi driver đó được implement thật. Quan trọng — **giữ nguyên, không tạo mới**, khi migrate DNS `api.donve.vn` từ CF Workers sang VPS: `BETTER_AUTH_SECRET` (đổi = mọi session hiện tại bị logout hàng loạt), `AI_KEY_MASTER_SECRET`, `PAYMENTS_KEY_MASTER_SECRET` (đổi = mất dữ liệu, xem §3). Vì Cloudflare secret không đọc lại được, giá trị copy sang Dokploy phải lấy từ **bản backup bạn tự giữ khi set lần đầu** (không có cách nào lấy lại từ Cloudflare) — nếu chưa từng backup, đây là lúc phải thiết kế lại quy trình để không rơi vào tình huống mất key khi đổi hạ tầng.
