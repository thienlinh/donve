# Database — runbook cho người mới bắt đầu

Dành cho người chưa quen làm việc với database. File này đi cùng `docs/architecture/database-schema.md` (schema đầy đủ) và `docs/architecture/architecture.md` §6/§6.1 (lý do thiết kế multi-tenancy) — ở đây tập trung vào **thao tác thực tế**: setup, sửa schema, viết query, debug.

## 1. Bức tranh tổng quan (30 giây)

- **Postgres** (Neon ở production, docker local khi dev) + **Drizzle ORM**. Không dùng Prisma/TypeORM.
- Toàn bộ code DB nằm ở `packages/db` — app khác (`apps/api`) chỉ import từ `@dv/db`, không tự viết SQL raw.
- Có **2 driver** vì app chạy trên 2 runtime khác nhau (`apps/api/src/lib/db.ts`):
  - CF Workers → `createNeonDb` (HTTP driver, không có connection thật)
  - Bun/VPS → `createPostgresDb` (connection pool thật, transaction thật)
- Mọi bảng nghiệp vụ đều có `org_id` — đây là app **multi-tenant** (nhiều tổ chức dùng chung 1 DB, dữ liệu tách biệt bằng Postgres Row-Level Security, không phải chỉ lọc ở code).

Cây thư mục cần biết:

```
packages/db/
  drizzle.config.ts       # config cho drizzle-kit (đọc DATABASE_URL)
  src/schema/              # định nghĩa bảng — sửa ở đây khi cần đổi schema
  src/client/               # 2 driver (neon-http, postgres-js) + type Db
  src/org-scope.ts         # withOrgScope — BẮT BUỘC dùng cho mọi query
  src/repositories/         # 1 file / 1 domain, wrap CRUD + query nghiệp vụ
  migrations/                # SQL do drizzle-kit generate ra — không sửa tay
  src/seed.ts                 # seed dữ liệu demo
  test/org-scope.integration.test.ts  # proof RLS hoạt động thật (dùng testcontainers)
```

## 2. Setup lần đầu (local)

```bash
docker-compose up -d postgres        # postgres:17-alpine, user/pass/db = donve/donve/donve
```

Set `DATABASE_URL` (trong `.env` hoặc export trực tiếp) cho các app dùng nó:

```
DATABASE_URL=postgres://donve:donve@localhost:5432/donve
```

Chạy migration + seed:

```bash
cd packages/db
bun run db:migrate   # áp tất cả file .sql trong migrations/ vào DB
bun run db:seed      # tạo demo org + platform skills (src/seed.ts)
```

> ⚠️ Role `donve` do `docker-compose.yml` tạo là **superuser** của Postgres image chính thức. Superuser bypass RLS vô điều kiện — nghĩa là nếu bạn `psql` thẳng vào DB local bằng role này, bạn **thấy hết dữ liệu mọi org**, kể cả khi quên set `app.current_org`. Đừng lấy hiện tượng đó làm bằng chứng "RLS không hoạt động" — RLS chỉ được chứng minh đúng qua `test/org-scope.integration.test.ts` (dùng role không phải superuser, xem mục 6).

## 3. Quy ước schema (đọc trước khi thêm bảng)

Định nghĩa đầy đủ ở `docs/architecture/database-schema.md`; quy tắc lặp lại ở mọi bảng nghiệp vụ:

| Quy ước | Ví dụ | Vì sao |
| --- | --- | --- |
| PK là ULID dạng `text`, không phải serial int | `id: id()` (helper ở `schema/columns.ts`) | Sort được theo thời gian tạo, không lộ số lượng record như auto-increment |
| Luôn có `org_id` | `orgId: text("org_id").notNull()` | Cột này là điều kiện của RLS policy — thiếu là vỡ multi-tenancy |
| Luôn có `created_at`/`updated_at` | `...timestamps` (helper) | Audit trail |
| Bảng có thể xoá mềm thì có `deleted_at` | `leads`, `landing_pages`, `campaigns` | Cho phép restore, và unique index thường loại trừ hàng đã xoá (`.where(sql\`deleted_at IS NULL\`)`) |
| Field mở rộng dùng `jsonb`, không thêm cột tuỳ biến | `formConfig`, `customFields`, `settings` | Tránh migration liên tục cho field ít dùng/khác nhau theo org |

Thêm bảng mới nhạy cảm (chứa dữ liệu của 1 org cụ thể) → **phải** thêm RLS policy, xem mục 5.

## 4. Sửa schema — luồng chuẩn

1. Sửa file trong `packages/db/src/schema/*.ts` (thêm bảng/cột, sửa enum, thêm index...).
2. Generate migration:
   ```bash
   cd packages/db
   bun run db:generate
   ```
   Lệnh này **đọc schema, diff với `migrations/meta/_journal.json`**, và tạo file SQL mới `NNNN_<tên_random>.sql` — không tự chạy vào DB.
3. **Đọc lại file SQL vừa sinh ra trước khi migrate** — drizzle-kit đôi khi đoán sai (đặc biệt khi rename cột/bảng, nó có thể sinh DROP + CREATE thay vì RENAME → mất dữ liệu). Sửa tay file SQL nếu cần trước khi chạy.
4. Nếu bảng mới chứa dữ liệu nhạy cảm theo org → thêm 2 việc trong cùng file SQL hoặc file kế tiếp:
   - Áp policy `orgIsolationPolicy()` (từ `schema/rls.ts`) trong định nghĩa bảng.
   - Thêm `ALTER TABLE "ten_bang" FORCE ROW LEVEL SECURITY;` giống `migrations/0001_force_row_level_security.sql` — thiếu dòng này thì role sở hữu bảng (thường là role chạy migration) vẫn bypass được RLS.
5. Chạy migrate:
   ```bash
   bun run db:migrate
   ```
6. Nếu bảng có API/repository đi kèm, viết repository mới (mục 6) và cập nhật `src/repositories/index.ts`.

Không bao giờ sửa tay file trong `migrations/` đã chạy rồi trên môi trường khác (staging/prod) — coi migration đã áp dụng là bất biến, sai thì tạo migration mới để sửa.

## 5. Multi-tenancy & RLS — phần quan trọng nhất

**Luật duy nhất cần nhớ: mọi query phải đi qua `withOrgScope` (`packages/db/src/org-scope.ts`).** Đây là nơi duy nhất được phép chạy `set_config('app.current_org', ...)`, và Postgres RLS policy (`schema/rls.ts`) chặn mọi hàng không khớp `org_id = current_setting('app.current_org')`.

Vì sao phức tạp hơn "chỉ thêm `WHERE org_id = ...` ở code": nếu ai đó quên thêm điều kiện đó ở 1 chỗ (bug rất dễ xảy ra khi code lớn dần), RLS ở tầng Postgres vẫn chặn — đây là phòng thủ 2 lớp (defense-in-depth), không phải thay thế việc lọc ở code.

2 driver xử lý khác nhau, `withOrgScope` đã che giấu khác biệt này:

- **postgres-js** (Bun/VPS): dùng transaction thật — `set_config` và query chạy tuần tự trong cùng 1 transaction.
- **neon-http** (CF Workers): không có `.transaction()` thật, chỉ có `.batch()` — `set_config` và query phải nằm chung 1 lệnh `.batch()` (1 round-trip HTTP), tách ra 2 lệnh riêng thì `SET LOCAL` sẽ không áp dụng cho lệnh thứ 2.

**Hệ quả thực tế**: `build` trong `withOrgScope` chỉ được chứa **đúng 1 câu query**. Nếu cần nhiều statement trong 1 transaction (ví dụ advisory lock + insert, hoặc trừ credit + ghi usage) — **không** dùng `withOrgScope`, phải viết helper riêng giống comment trong `org-scope.ts` đã ghi chú.

## 6. Viết repository mới

Đa số bảng org-scoped chỉ cần CRUD cơ bản — dùng `createOrgScopedRepository` (`repositories/scoped-repository.ts`), tự có sẵn `findById`, `list`, `insert`, `update`, tất cả đã bọc `withOrgScope`.

```ts
// packages/db/src/repositories/vi-du.ts
import { viDuTable } from "../schema/....js";
import { createOrgScopedRepository } from "./scoped-repository.js";

export const viDuRepository = createOrgScopedRepository(viDuTable);
```

Cần query nghiệp vụ riêng (dedupe, join, filter đặc thù) → spread base rồi thêm method, xem ví dụ thật ở `repositories/leads.ts` (`findByPhone`). Luôn viết query bên trong `withOrgScope`, không tự `db.raw.select()...` trực tiếp trừ khi có lý do rõ ràng (và khi đó phải tự set `app.current_org` bằng tay).

Đừng quên export file mới ở `src/repositories/index.ts`.

## 7. Debug — các case hay gặp

**"Query trả về rỗng dù chắc chắn có data trong DB"** → 99% là quên bọc `withOrgScope`, hoặc `orgId` truyền vào sai giá trị. RLS coi "không có `app.current_org` khớp" giống hệt "không có hàng nào" — nó fail closed, không throw lỗi. Kiểm tra lại orgId truyền vào repository trước khi nghi ngờ gì khác.

**"Set_config có set nhưng query sau đó vẫn không thấy org"** → Đang chạy trên neon-http mà tách `set_config` và query thành 2 lệnh execute riêng thay vì chung 1 `.batch()`. Xem lại mục 5 — chỉ `withOrgScope` mới làm đúng, đừng tự gọi `set_config` tay.

**"Cần nhiều statement atomic (transaction) trên CF Workers"** → neon-http không có transaction thật. Dùng `.batch()` trực tiếp cho các trường hợp cụ thể đã biết trước (advisory lock cho `pageVersions.seq`, atomic credit debit — xem `docs/architecture/database-schema.md` mục "Ghi chú thiết kế" #8, #9), không cố nhét qua `withOrgScope`.

**"Muốn xem RLS có thật sự chặn không, test tay thế nào"** → Đừng test bằng cách `psql` local (role `donve` là superuser, bypass RLS luôn — xem cảnh báo mục 2). Chạy integration test thật:

```bash
cd packages/db
bun test test/org-scope.integration.test.ts
```

Test này tự dựng Postgres qua Docker (testcontainers) + tạo 2 role non-superuser (1 role sở hữu bảng, 1 role app dùng thật) để tái hiện đúng điều kiện production. Cần Docker đang chạy.

**"Migration mới chạy `db:migrate` báo lỗi / bị treo giữa chừng"** → Kiểm tra `migrations/meta/_journal.json` xem migration nào đã đánh dấu applied. Nếu 1 migration fail giữa chừng (vd lỗi cú pháp SQL tay sửa ở bước 4 mục 4), Postgres đã rollback statement đó (drizzle chạy trong transaction), nhưng file migration coi như chưa "clean" — sửa lại SQL rồi chạy lại `db:migrate`, không tự sửa `_journal.json` tay.

**"Seed script báo lỗi DATABASE_URL is required"** → `src/seed.ts` đọc `process.env.DATABASE_URL` trực tiếp, không có default — export biến môi trường trước khi chạy `bun run db:seed`.

**"Muốn xem nhanh data trong DB mà không viết code"** → `psql $DATABASE_URL` (local) hoặc dùng Neon console SQL editor (staging/prod). Nhớ: kết quả bạn thấy qua đường này **không đi qua RLS như app thật** nếu bạn đang dùng role sở hữu bảng/superuser — chỉ dùng để xem dữ liệu thô, không dùng để verify logic phân quyền.

## 8. Lệnh thường dùng

| Việc | Lệnh |
| --- | --- |
| Khởi động Postgres local | `docker-compose up -d postgres` |
| Sinh migration từ schema đã sửa | `cd packages/db && bun run db:generate` |
| Áp migration vào DB | `cd packages/db && bun run db:migrate` |
| Seed data demo | `cd packages/db && bun run db:seed` |
| Chạy test (bao gồm integration test RLS) | `cd packages/db && bun test` |
| Xem schema hiện tại (đối chiếu code) | đọc `packages/db/src/schema/*.ts`, không có UI riêng |
| Kết nối psql trực tiếp | `psql $DATABASE_URL` |

## 9. Checklist trước khi merge thay đổi liên quan DB

- [ ] Đã chạy `bun run db:generate` và **đọc lại** file SQL sinh ra (không có DROP/rename ngoài ý muốn)
- [ ] Bảng mới chứa data theo org → có `org_id`, có RLS policy (`orgIsolationPolicy()`), có `FORCE ROW LEVEL SECURITY`
- [ ] Mọi query mới đi qua `withOrgScope` hoặc `createOrgScopedRepository`
- [ ] Nếu cần multi-statement atomic → không dùng `withOrgScope`, có helper riêng rõ ràng
- [ ] `bun test` xanh trong `packages/db` (bao gồm integration test nếu đổi RLS/schema nhạy cảm)
- [ ] `bun run lint` sạch ở root (theo `.claude/rules/tech-stack.md`)
