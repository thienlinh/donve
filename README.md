# Donve — Content-Ops CRM Platform

DonVe là nền tảng vận hành phễu bán hàng cho creator Việt Nam: AI tạo trang bán hàng, gom lead, đối soát thanh toán và theo dõi việc giao sản phẩm. Kiến trúc: [`docs/architecture/architecture.md`](docs/architecture/architecture.md). Định hướng sản phẩm: [`docs/product/thesis.md`](docs/product/thesis.md) · [`docs/product/roadmap.md`](docs/product/roadmap.md) · [`docs/product/decisions.md`](docs/product/decisions.md). File này chỉ để **chạy dự án trên máy bạn và tự verify việc đã làm**.

## Yêu cầu môi trường

- [Bun](https://bun.sh) 1.4.0 (đúng version pin trong `.github/workflows/ci.yml`)
- Docker Desktop đang chạy — bắt buộc cho test tích hợp (`@testcontainers/postgresql` tự bật/tắt Postgres thật cho mỗi lần chạy test, không mock DB) và cho local dev stack ở dưới.

## Cài đặt

```bash
bun install
```

## Chạy local dev

Stack local dùng docker-compose (Postgres + Redis container trên máy bạn) — không phụ thuộc Neon/Upstash khi code hàng ngày, không tốn phí, không cần VPS:

```bash
docker compose up -d        # postgres:18 (đã wired) + valkey (chuẩn bị cho sau này, xem ghi chú dưới)
cp apps/api/.env.example apps/api/.env.local
cp apps/donve/.env.example apps/donve/.env.local
# DATABASE_URL=postgres://donve:donve@localhost:5432/donve  (đúng user/pass/db mặc định trong docker-compose.yml)
# BETTER_AUTH_SECRET: chuỗi random bất kỳ (openssl rand -hex 32)
# RESEND_API_KEY: để trống là được — flow verify/invite email sẽ log ra console thay vì gửi thật
DATABASE_URL=postgres://donve:donve@localhost:5432/donve bun run --filter=@dv/db db:migrate
# ^ packages/db đọc thẳng process.env.DATABASE_URL (drizzle.config.ts) — không tự đọc apps/api/.env.local, nên phải set inline như trên
bun run dev                 # turbo chạy song song apps/api (bun.ts, :3000) + apps/donve (:5173) + apps/edge-router (wrangler dev, :8787)
```

> `apps/edge-router` chạy qua `wrangler dev` (local simulated KV/R2). Worker hiện phục vụ landing đã publish, SEO files và event beacon; các binding id giả (`dev-placeholder`) chỉ để `wrangler dev` boot được local.

> `packages/db` có 2 driver: `neon-http` (dùng khi deploy CF Workers, đọc `DATABASE_URL` dạng Neon) và `postgres-js` (dùng cho Bun/VPS/local, đọc `DATABASE_URL` Postgres thường) — driver được chọn qua env, không đổi code khi đổi môi trường. Container Postgres ở trên đã đủ để chạy toàn bộ flow auth/org (`/api/auth/*`, không rate-limit) hoàn toàn offline, không cần Neon/Upstash.
>
> Container Valkey hiện **chưa được driver nào dùng** — `packages/drivers` mới có impl Upstash (REST, cần `UPSTASH_REDIS_URL`/`UPSTASH_REDIS_TOKEN` thật) cho cache/realtime và QStash cho jobs; driver `ioredis` local (wire-compatible với Valkey) là việc tương lai khi cần tự host. Container này chỉ để sẵn hình dạng stack, không tắt gì hôm nay — 2 route duy nhất cần Upstash thật là `/public/*` và `/webhooks/*` (rate limit), chưa cản trở việc verify DoD dưới đây.

## Debug lỗi thường gặp khi chạy local

- **Request từ app web trả 404, URL có dạng `localhost:5173/api/...`**: `apps/donve/.env.local` sai `VITE_API_URL` (đang trỏ vào chính Vite dev server thay vì API `:3000`). Sửa lại `VITE_API_URL=http://localhost:3000` rồi restart `bun run dev` — Vite không luôn hot-reload biến `import.meta.env` giữa chừng.
- **API log `password authentication failed for user "<tên máy bạn>"`**: `apps/api/.env.local` chưa tồn tại hoặc `DATABASE_URL` để trống — driver `postgres-js` fallback về user hệ điều hành thay vì user `donve` trong docker-compose. Tạo file từ `cp apps/api/.env.example apps/api/.env.local` và điền `DATABASE_URL=postgres://donve:donve@localhost:5432/donve`.
- **`bun run --filter=@dv/db db:migrate` báo `url: undefined`**: `packages/db/drizzle.config.ts` đọc thẳng `process.env.DATABASE_URL`, không tự đọc `apps/api/.env.local` — phải set inline như lệnh ở mục "Chạy local dev" trên.
- **`apps/edge-router` (`wrangler dev`) báo "Missing entry-point"**: thiếu `wrangler.jsonc` — đã có sẵn trong repo, nếu vẫn gặp nghĩa là file bị xoá/chưa pull.

## Chạy test

```bash
bun run test        # turbo run test — mỗi package tự start/stop Postgres container riêng qua testcontainers
```

Không cần tự tạo DB cho test — `apps/api/test/*.integration.test.ts` và `packages/db/test/*.integration.test.ts` tự dựng Postgres thật trong container, migrate, chạy, rồi huỷ. Docker Desktop phải đang chạy, nếu không test sẽ fail ở bước khởi tạo container (không phải bug code).

## Kiểm tra trước khi commit / trước khi báo xong việc

```bash
bun run lint && bun run fmt && bun run typecheck && bun run build && bun run test
```

Đây là rule bắt buộc ở `.claude/rules/tech-stack.md` — lefthook đã tự chạy lint+fmt ở pre-commit và typecheck (affected) ở pre-push, nhưng chạy full command trên trước khi coi một task là "xong".

## Tự verify Phase 0 (nền móng) đã đúng chưa

Chạy xong các bước "Chạy local dev" ở trên rồi thử tay:

1. Mở `http://localhost:5173`, đăng ký tài khoản mới → nhận link verify email (in ra console vì không có `RESEND_API_KEY` thật) → verify.
2. Tạo 1 organization, mời 1 thành viên khác (dùng email thứ 2) → thành viên login, thấy org trong danh sách.
3. Đổi role thành viên đó (owner/admin/editor/sales) → xác nhận hành động bị chặn/cho phép đúng theo bảng quyền `packages/auth/src/permissions.ts`.
4. `bun run test` xanh toàn bộ — riêng `apps/api/test/cross-tenant.integration.test.ts` là bộ test quan trọng nhất (chống IDOR/cross-tenant leak qua id org/member khác), phải xanh trước khi coi việc "done".

## Cấu trúc thư mục

Xem `.claude/rules/tech-stack.md` §Monorepo layout — đây là nguồn chốt, không lặp lại ở đây để tránh lệch khi cấu trúc đổi.
