# 07 — Hạ tầng, Chi phí & Chiến lược Free tier → VPS Việt Nam

## 1. Khuyến nghị tổng: HYBRID, không phải "hoặc CF hoặc VPS"

Chia hệ thống theo bản chất workload:

| Workload | Nơi chạy vĩnh viễn | Lý do |
|---|---|---|
| **Landing serving** (`edge-router` + R2 + KV) | **Cloudflare edge — mãi mãi** | PoP tại VN → TTFB ~30–80ms toàn quốc, chịu viral traffic không lo, free gần như vô hạn ở tầng này, SSL wildcard tự động. Đưa về VPS là tự bắn vào chân CWV/SEO |
| Dashboard SPA (static) | Cloudflare Pages — mãi mãi | Static host free, không có lý do chuyển |
| **API (Hono)** | CF Workers (giai đoạn 1) → **VPS VN (Bun)** khi cần | Workers free 100k req/ngày đủ lâu; VPS khi cần job dài, Playwright, BullMQ, latency DB thấp |
| Postgres | Neon free (giai đoạn 1) → self-host trên VPS | Neon free 0.5GB đủ vài nghìn lead; self-host khi cần dung lượng/latency (bạn đã nghiên cứu Autobase — dùng lại kiến thức đó, nhưng với 1 VPS thì Postgres + pgBackRest là đủ, chưa cần HA cluster) |
| Redis / Jobs | Upstash + QStash (giai đoạn 1) → Redis + BullMQ trên VPS | QStash HTTP-based hợp serverless; BullMQ cần TCP long-lived → hợp VPS |
| Assets/Versions/Deployments | R2 — mãi mãi | S3-compatible, egress $0, 10GB free |

**Điểm mấu chốt thiết kế:** vì `packages/drivers` trừu tượng hoá jobs/cache/storage/realtime và Hono chạy được cả Workers lẫn Bun, **migration = đổi env + docker compose up**, không refactor.

### 1.1 Rủi ro phụ thuộc hạ tầng Cloudflare (góc độ chi phí/vận hành)

Quyết định "landing serving vĩnh viễn trên Cloudflare" ở trên là **có chủ đích**, không phải sơ suất — nhưng cần nói rõ cái giá phải trả: KV + R2 + Cache đều là hạ tầng CF, nên một sự cố CF toàn cầu ảnh hưởng **tất cả tenant cùng lúc**. Threat model kỹ thuật chi tiết (attack surface, WAF, v.v.) đã có ở architecture.md §7/§8; ở đây chỉ nói góc chi phí/vận hành.

Biện pháp giảm thiểu kiểu "bảo hiểm" — không phải failover tự động, không dựng thêm hạ tầng chạy song song:
- Backup định kỳ (cron job nhẹ, vd hàng ngày) object `deployments/*` từ R2 sang một object storage khác giá rẻ (vd Backblaze B2) — chỉ là nguồn khôi phục khi cần, không nhằm chuyển traffic sang ngay.
- Uptime monitor đơn giản, miễn phí (vd UptimeRobot hoặc tương tự) theo dõi vài subdomain mẫu, báo founder khi có sự cố CF diện rộng.

Đây **không phải** giải pháp high-availability multi-cloud: chấp nhận rủi ro downtime khi CF down, chỉ đảm bảo không mất dữ liệu và phản ứng nhanh.

## 2. Free tier — số liệu giới hạn & mức "đủ cho bao nhiêu"

(Số liệu theo public pricing các dịch vụ; kiểm lại khi triển khai vì có thể thay đổi.)

| Dịch vụ | Free tier | Quy đổi thực tế |
|---|---|---|
| CF Workers | 100.000 req/ngày, 10ms CPU/req | ~vài trăm tenant hoạt động nhẹ; landing serving ăn phần lớn → tách sang cache: request cache-hit không tốn Worker CPU đáng kể |
| CF Pages | Unlimited bandwidth static, 500 builds/tháng | Dashboard + không giới hạn thực tế |
| CF KV | 100k reads/ngày, 1k writes/ngày | Hostname lookup có Cache API đệm → writes chỉ khi publish |
| R2 | 10GB storage, 1M class A + 10M class B ops/tháng, egress $0 | ~200–500 landing kèm assets |
| Neon | 0.5GB storage, autosuspend | ~50–100k leads text thuần |
| Upstash Redis | 500k commands/tháng | Rate limit + cache session đủ |
| QStash | 500 messages/ngày | Publish jobs + webhook retry đủ giai đoạn đầu |
| Turnstile, CF for SaaS | Free / 100 custom hostnames free | Chống spam + custom domain 100 tenant đầu |
| Sentry | 5k errors/tháng | Đủ |
| Resend | 3.000 email/tháng, 100/ngày | Đủ giai đoạn đầu (verify + invite + digest); domain cần verify DKIM/SPF trước khi gửi thật |
| OpenRouter (BYOK) | Tuỳ model — nhiều model free (`:free` suffix) hoặc vài cent/1M token (DeepSeek) | Free tier AI thực chất khả thi hơn cả BYOK Anthropic/OpenAI trực tiếp, đúng hướng "free/rẻ trước" |
| **Tổng chi phí giai đoạn 1** | **~0đ/tháng** (chỉ tên miền ~300k/năm) | AI: Free tier = BYOK nên nền tảng không trả |

Ngưỡng phải hành động: Workers > 70k req/ngày hoặc Neon > 0.4GB hoặc cần Playwright chụp thumbnail server-side ổn định → kích hoạt giai đoạn 2.

**Chốt policy retention `pageVersions`/R2** (trước là open question, nay quyết định để không phải quay lại khi có traffic thật): **giữ vĩnh viễn các version "quan trọng", tự động prune version "rác" sau ngưỡng thời gian/số lượng** — không chọn thuần "giữ hết" (phình vô hạn khi AI patch liên tục) cũng không chọn thuần "xoá theo tuổi" (mất lịch sử có giá trị).

- **Không bao giờ prune**: version đang được `deployments` trỏ tới (`pageVersions.id = deployments.pageVersionId` bất kỳ), và version có `label` (user chủ động đặt tên/gắn mốc).
- **Prune job (P1, chạy định kỳ, vd hàng tuần)**: với mỗi `landingPageId`, trong các version **không** thuộc 2 nhóm trên (tức version trung gian do AI patch tự động tạo, chưa từng publish, chưa gắn nhãn), giữ lại **50 version gần nhất** và xoá version cũ hơn **90 ngày** — điều kiện nào chạm trước thì áp dụng, tránh vừa phình vô hạn theo thời gian vừa phình vô hạn theo số lượng patch. Xoá nghĩa là xoá object R2 (`htmlKey`/`srcmapKey`) + set `pageVersions.prunedAt`, giữ lại row Postgres (nhẹ) để lịch sử chat/audit vẫn liên kết được, chỉ mất khả năng "restore" version đó.
- **Vì sao quyết định này tối ưu**: R2 free 10GB đủ rộng nên không cần vội ở v1 (job này để P1, không block P0), nhưng định nghĩa rõ ngưỡng ngay từ đầu tránh phải thiết kế lại khi landing đầu tiên có traffic AI patch dày đặc (dễ xảy ra hơn dự kiến vì mỗi comment/chat sửa nhỏ đều tạo 1 version theo FR-B-27).

### 2.1 Kiểm soát chi phí khi 1 landing viral

- R2 egress $0 (xem bảng trên) nên viral traffic không đội chi phí băng thông. Chi phí thật nằm ở **CF Workers request count** (100k req/ngày free) và **CF KV read count** (100k reads/ngày free) — xem bảng §2.
- Asset tĩnh (ảnh/video/`landing-runtime`) đặt tên theo content-hash, header `Cache-Control: public, max-age=31536000, immutable` → cache ở edge/browser, không tính lại request khi đã cache.
- Cảnh báo (đủ cho v1, không cần dựng dashboard riêng): theo dõi qua CF Analytics; alert tự động (CF Workers Analytics Engine hoặc đơn giản hơn là email alert) khi 1 hostname vượt >10x request/ngày so với trung bình 7 ngày trước đó.
- Nguyên tắc quan trọng: **không** tự động chặn/giới hạn traffic của tenant khi phát hiện viral (mất doanh thu của họ) — chỉ cảnh báo cho founder để chủ động đánh giá; viral có thể là tín hiệu tốt (tenant đó nên lên gói cao hơn).
- Video (giữ nguyên file gốc trên R2 theo FR-B-29, xem functional-requirements.md): khi 1 landing vượt ~5GB egress-tương-đương/tháng, chuyển sang **Bunny Stream** (không phải Cloudflare Stream — tính phí theo GB thực tế thay vì theo phút cố định, rẻ hơn rõ rệt cho video nén hợp lý như hero/demo clip; chi tiết + số liệu so sánh ở functional-requirements.md NFR-15) — quyết định theo nhu cầu thực tế phát sinh, không làm trước.
- Rate limit `/e/*` (event beacon) và endpoint polling trạng thái đơn hàng, theo IP + campaign — bổ sung cho cache 2s ở edge đã có (architecture.md §5.3), tránh 1 landing viral kéo sập backend polling dù không tốn băng thông.

## 3. Giai đoạn 2 — VPS Việt Nam + Dokploy

### 3.1 Cấu hình đề xuất
- VPS 4 vCPU / 8GB RAM / 100GB NVMe tại VN (Viettel IDC / VNG Cloud / CMC / hoặc rẻ hơn: VinaHost, AZDIGI...) — khoảng **300–600k VND/tháng**. Nằm gọn trong budget bạn nêu.
- Stack Dokploy (bạn đã quen docker):

```yaml
# docker-compose (Dokploy quản lý) — dịch vụ chính
services:
  api:        # Bun + Hono (image build từ monorepo, entrypoint bun.ts)
  worker:     # BullMQ workers: build_deploy, thumbnail (Playwright), webhook retry, email
  postgres:   # postgres:17 + pgbackrest sidecar (backup → R2, PITR)
  redis:      # redis:7 (BullMQ + cache + pub/sub realtime)
  # KHÔNG có nginx cho landing — landing vẫn ở Cloudflare
  # Traefik do Dokploy quản lý cho api.domain
```

- Cloudflare vẫn đứng trước `api.` (proxy, WAF, cache) → VPS không lộ IP.
- Realtime SSE: hub trong api process + Redis pub/sub giữa instances.

### 3.2 Migration runbook (thiết kế sẵn từ ngày 0)
1. `drizzle-kit` schema như nhau; dump Neon (`pg_dump`) → restore VPS; bật maintenance mode 15 phút (dashboard only — landing không ảnh hưởng).
2. Đổi env DNS `api.donve.vn` từ Workers route → VPS (CF proxied) — contract API không đổi.
3. Đổi driver env: `JOBS_DRIVER=bullmq`, `CACHE_DRIVER=ioredis`, `DB_URL=postgres://local`.
4. R2/KV/edge-router giữ nguyên — không đụng.
5. Rollback = trỏ DNS lại Workers (giữ Workers deployment 30 ngày).

### 3.3 "Mua VPS từ đầu luôn cho khỏi migrate?"
Phân tích thẳng: migrate theo runbook trên tốn ~1 buổi vì đã portable-by-design, còn vận hành VPS từ ngày 0 tốn tiền + tâm trí ops (patch OS, backup, monitor) trong chính giai đoạn bạn cần 100% năng lượng cho product. **Khuyến nghị: bắt đầu free tier, mua VPS ở phase 5–6 (implementation-plan.md) khi cần Playwright/BullMQ ổn định** — trừ khi bạn muốn dogfood Dokploy làm content dạy học sớm (lý do hợp lệ, và là lý do duy nhất nên mua sớm).

## 4. Publishing lên subdomain — chi tiết vận hành

- DNS: `*.donve.vn` → CNAME/route vào `edge-router` Worker; SSL wildcard CF tự lo.
- `edge-router` logic (hot path, tối ưu tối đa):

```
request → hostname
  → Cache API hit? trả ngay (immutable assets: cache 1 năm; html: cache 60s, purge khi deploy)
  → KV get hostname → {deployId} (KV cached at edge)
  → R2 get deployments/<deployId>/<path> → set headers (CSP, cache) → cache.put → trả
  → 404 → trang "landing không tồn tại" branded
/e/view, /e/submit → ghi event (batch qua queue) — không chặn response
```

- Custom domain: Cloudflare for SaaS (custom hostnames) — tenant trỏ CNAME `landing.tencuaho.vn → ssl.donve.vn`, tự động cert; bảng `customDomains` theo dõi trạng thái verify.
- Atomic + rollback: deployment immutable theo `deployId`; đổi con trỏ KV là xong — giống mô hình bạn đã làm với Cloudflare Pages nhưng chủ động hơn (không đụng limit 100 projects của Pages, không phụ thuộc build queue của Pages).

## 5. SEO & Core Web Vitals cho landing (thực thi NFR-01)

Build pipeline bắt buộc (không phụ thuộc AI "nhớ" làm đúng — pipeline ép):
1. Minify HTML/CSS; inline toàn bộ CSS (landing 1 trang — inline luôn tối ưu nhất).
2. Ảnh: chuyển AVIF/WebP + `srcset` + width/height chống CLS; ảnh hero → `<link rel="preload" as="image">`; lazy-load ảnh dưới fold.
3. Font: hệ thống (system-ui stack) mặc định; nếu brand font → subset woff2 + `font-display: swap`, preload.
4. JS duy nhất: `landing-runtime` (~6KB gzip, `defer`), Turnstile lazy khi form vào viewport.
5. Meta: title/description từ campaign, canonical, OG + `.thumbnail.jpg` làm og:image, JSON-LD (`Course`/`Product` + `Offer` giá VND), lang="vi".
6. `sitemap.xml`/`robots.txt` sinh per hostname tại edge-router.
7. Lighthouse CI chạy sau mỗi deploy (sample) — score lưu `deployments.meta`, hiện trong dashboard; < 90 thì cảnh báo tenant kèm gợi ý AI fix.

## 6. CI/CD

- GitHub Actions: `turbo run lint typecheck test build` (Oxlint nhanh, tsgo typecheck); affected-only nhờ turbo cache (remote cache: R2-backed hoặc Vercel remote cache free).
- Deploy: wrangler deploy (api CF + edge-router) trên merge main; dashboard → CF Pages; giai đoạn VPS: build image → registry → Dokploy webhook auto-deploy.
- Environments: `dev` (local: miniflare/wrangler dev + Neon branch), `staging` (Neon branch — tính năng branch của Neon rất hợp), `prod`.
- Secrets: Wrangler secrets / Dokploy env; masterKey mã hoá BYOK tách riêng, rotate được (re-encrypt job).
