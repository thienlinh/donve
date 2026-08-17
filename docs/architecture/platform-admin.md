# 09 — Platform admin (vận hành xuyên-tenant)

Bổ sung cho architecture.md §6/§6.1 (multi-tenant & RLS). Tài liệu này thiết kế **nền móng** cho việc vận hành nội bộ xuyên nhiều tenant (support, xử lý vi phạm, xem tổng quan usage) — hiện hệ thống **không có** role nào cao hơn `owner` của 1 org (xem `packages/auth/src/permissions.ts`), mọi việc xuyên-tenant hiện chỉ làm được bằng cách connect DB tay, không audit, không kiểm soát.

## 0. Mục tiêu & phi mục tiêu

**Làm nền móng ngay** (rẻ, khó rework nếu để sau — đổi schema/RLS khi đã có data thật tốn hơn nhiều so với lúc chưa có):

- Bảng lưu ai là platform staff, tách hẳn khỏi `memberships` (memberships luôn gắn 1 org, staff thì không).
- RLS mở thêm đường đọc xuyên-tenant **an toàn** (không phá lớp phòng thủ ghi hiện có).
- Helper DB tương đương `withOrgScope` nhưng cho platform staff.
- Bảng audit riêng cho hành động platform-level.

**CHƯA làm ngay** (đợi có nhu cầu vận hành thật, tránh xây thứ không ai dùng):

- UI quản lý — chỉ cần route/API đọc cơ bản (list org, xem chi tiết 1 org), chưa cần dashboard đẹp.
- Phân cấp nhiều role platform (`support`, `billing_ops`, `platform_admin`...) — bắt đầu 1 role duy nhất `platform_admin`, tách khi thực sự có ≥2 nhóm người dùng khác nhau.
- App riêng (`apps/admin`) — dùng route-group trong `apps/api`/`apps/dashboard` hiện có, tách app khi có lý do cụ thể (team riêng, cần isolate deploy/security domain).
- "Ghi xuyên-tenant tổng quát" (kiểu god-mode update mọi bảng) — mọi hành động ghi (disable org, hoàn tiền hộ...) vẫn phải là 1 endpoint nghiệp vụ cụ thể, tự gọi `withOrgScope(targetOrgId, ...)` bình thường + ghi audit, không có đường ghi "không cần org context".

## 1. Data model

Bảng mới, **không** phải cột thêm vào `memberships` — staff không thuộc về 1 org nào, gắn role kiểu `memberships.role` sẽ sai vì cột đó luôn đi kèm `org_id notNull`.

```ts
// packages/db/src/schema/platform.ts
import { pgTable, text } from "drizzle-orm/pg-core";
import { id, timestamps } from "./columns.js";

/** Không org_id — quyền này nằm ngoài mọi tenant. Gán tay qua script, chưa cần UI. */
export const platformStaff = pgTable("platform_staff", {
  id: id(),
  userId: text("user_id").notNull().unique(), // ref user.id (better-auth)
  role: text("role", { enum: ["platform_admin"] }).notNull(),
  ...timestamps
});

/** Audit tách riêng khỏi `audit_logs` (bảng đó gắn liền 1 org, RLS list ở architecture.md §6
 * chưa gồm nó nhưng ý nghĩa vẫn là "log của 1 tenant"). Hành động platform-level luôn ghi log —
 * không tuỳ chọn, vì đây là bề mặt rủi ro compliance (NFR-13) lớn hơn hẳn thao tác trong 1 org. */
export const platformAuditLogs = pgTable("platform_audit_logs", {
  id: id(),
  staffUserId: text("staff_user_id").notNull(),
  action: text("action").notNull(), // "org.view", "org.disable", "refund.assist"...
  targetOrgId: text("target_org_id"), // null cho hành động không gắn 1 org cụ thể (vd "list all orgs")
  targetType: text("target_type"),
  targetId: text("target_id"),
  meta: text("meta"), // jsonb nếu cần cấu trúc — text tối thiểu đủ dùng lúc đầu
  ...timestamps
});
```

## 2. RLS — mở đường đọc, không đụng đường ghi

Đây là chỗ dễ làm sai nhất. **Không sửa `orgIsolationPolicy()` hiện có** (thêm `OR is_platform_admin` vào nó sẽ mở luôn cả write path — 1 bug ở middleware set sai session var là ghi đè được dữ liệu org khác). Thay vào đó, Postgres RLS cho phép nhiều **permissive policy** trên cùng 1 lệnh — chúng OR với nhau — nên thêm 1 policy **chỉ cho SELECT**:

```ts
// packages/db/src/schema/rls.ts — thêm cạnh orgIsolationPolicy(), không sửa nó
export const platformReadPolicy = () =>
  pgPolicy("platform_read", {
    for: "select", // KHÔNG "all" — platform staff không được ghi qua đường này
    using: sql`current_setting('app.is_platform_admin', true) = 'true'`
  });
```

Áp dụng vào từng bảng đang có `orgIsolationPolicy()` (`schema/ai.ts`, `schema/crm.ts`, `schema/studio.ts`...), thêm `platformReadPolicy()` vào cùng mảng:

```ts
(t) => [index("ix_leads_list").on(...), orgIsolationPolicy(), platformReadPolicy()]
```

Kết quả: 1 request có `app.current_org` set → thấy đúng 1 org (như hiện tại, không đổi). 1 request có `app.is_platform_admin = 'true'` set → **đọc được** mọi org, nhưng `INSERT/UPDATE/DELETE` vẫn bị chặn (không có policy nào cho phép ghi ngoài `orgIsolationPolicy`) — muốn ghi, code vẫn phải gọi `withOrgScope(targetOrgId, ...)` như bình thường, tức là platform admin "ghi hộ" 1 org thì cũng đi qua đúng luồng như chính org đó tự làm, không có shortcut riêng.

## 3. Helper `withPlatformScope`

Song song `withOrgScope` (`packages/db/src/org-scope.ts`), không sửa hàm cũ:

```ts
// packages/db/src/platform-scope.ts
export async function withPlatformScope<T>(
  db: Db,
  build: (qb: QueryBuilder) => unknown
): Promise<T> {
  if (db.kind === "postgres-js") {
    return db.raw.transaction(async (tx) => {
      await tx.execute(
        sql`select set_config('app.is_platform_admin', 'true', true)`
      );
      return (await build(tx)) as T;
    });
  }
  const setFlag = db.raw.execute(
    sql`select set_config('app.is_platform_admin', 'true', true)`
  );
  const query = build(db.raw);
  const results = await db.raw.batch([setFlag, query] as Parameters<
    typeof db.raw.batch
  >[0]);
  return results[1] as T;
}
```

Cùng lý do 2-driver như `withOrgScope` (architecture.md §6.1) — `set_config` và query phải chung 1 `.batch()` trên neon-http. Chỉ dùng hàm này cho **đọc** (list/detail xuyên-tenant); ghi luôn dùng `withOrgScope` với `orgId` cụ thể của tenant bị tác động.

## 4. Xác thực platform staff (API layer)

Middleware riêng, tách khỏi luồng session-org hiện có (`apps/api/src/middleware/request-context.ts` mới chỉ set `orgId=null` placeholder, chưa có auth middleware thật — đây là lúc thêm cả 2 cùng lúc cho nhất quán):

```ts
// apps/api/src/middleware/require-platform-staff.ts
export const requirePlatformStaff = createMiddleware<AppEnv>(
  async (c, next) => {
    const session = await getSession(c); // từ better-auth, theo cookie
    if (!session) return c.json({ error: "unauthorized" }, 401);

    const staff = await platformStaffRepository.findByUserId(
      db,
      session.user.id
    );
    if (!staff) return c.json({ error: "forbidden" }, 403);

    c.set("platformStaffId", staff.id);
    await next();
  }
);
```

Mount route group riêng trong `apps/api/src/app.ts`, tách hẳn khỏi `/api/*` (route tenant hiện có):

```ts
app.use("/platform/*", requirePlatformStaff);
// app.route("/platform", platformRoutes) — module list-orgs, org-detail (read-only lúc đầu)
```

Mọi handler trong `/platform/*` **đọc dữ liệu tenant** bắt buộc ghi 1 dòng `platformAuditLogs` trước khi trả response — không phải optional logging, vì đây là bề mặt compliance (NFR-13, xem `docs/runbooks/database.md` §7 cho lý do RLS/audit nói chung). Ngoại lệ duy nhất: `GET /platform/whoami` (mục 5) — không lộ dữ liệu tenant nào, chỉ xác nhận danh tính staff, và dashboard gọi nó ở mỗi lần vào `/platform` — ghi audit cho nó chỉ tạo nhiễu, không thêm giá trị truy vết.

## 5. Dashboard — route ẩn, không app riêng

Route `/platform` trong `apps/dashboard` (TanStack Router), file `src/routes/_authenticated/platform.tsx` — thừa hưởng gate session của `_authenticated`, gate thêm bằng cách gọi `GET /platform/whoami`: 403/401 → redirect `/landings`, giống hệt mọi khu vực không có quyền khác, không có trang lỗi riêng. Không có mục nav trỏ tới nó — vào bằng URL trực tiếp, đúng tinh thần "route ẩn". UI dùng `@dv/ui` (shadcn) như mọi trang khác — `features/platform/api.ts` (fetch + validate bằng `@dv/contracts`) + `features/platform/components/platform-orgs-page.tsx` (Card/Table/Badge/Empty/Spinner có sẵn, không viết primitive mới). Tách thành `apps/admin` riêng chỉ khi có lý do cụ thể sau này (team ops riêng, muốn domain/deploy tách biệt hẳn khỏi dashboard tenant).

## 6. Cấp quyền — chưa cần UI

```bash
cd packages/db
DATABASE_URL=... bun run grant-platform-staff you@example.com
```

`src/grant-platform-staff.ts` tra `user` theo email (không cần biết ULID tay), gọi `platformStaffRepository.grant`, idempotent (chạy lại báo "đã là staff", không insert trùng). Không xây UI "invite platform staff" cho tới khi có ≥2 người cần quyền này — 1 lệnh CLI là đủ ở quy mô hiện tại.

> ⚠️ **Bước tay bắt buộc sau mỗi lần deploy môi trường mới (staging/prod)** — xem mục 9 "Deploy — cái gì tự động, cái gì phải làm tay" ngay dưới đây. Dễ quên vì migration thì tự chạy nhưng cấp quyền thì không.

## 7. Thứ tự triển khai — đã xong tới đâu

1. ✅ Migration: `platform_staff` + `platform_audit_logs` + `platformReadPolicy()` áp vào 9 bảng đang có `orgIsolationPolicy()` (`migrations/0004_remarkable_zarda.sql`).
2. ✅ `packages/db`: `platform-scope.ts` (`withPlatformScope`), `repositories/platform-staff.ts`, `organizationsRepository.listAll`, export ở `index.ts`.
3. ✅ `apps/api`: `require-platform-staff.ts` middleware + `GET /platform/whoami` + `GET /platform/orgs` (`modules/platform/routes.ts`), response validate bằng `@dv/contracts` (`platformWhoAmISchema`, `organizationSchema`).
4. ✅ `packages/db/src/grant-platform-staff.ts` — CLI cấp quyền theo email, idempotent.
5. ✅ `apps/dashboard`: route ẩn `/platform`, `features/platform/api.ts` + `platform-orgs-page.tsx` (shadcn Table/Card/Badge/Empty/Spinner).
6. Dừng lại ở đây cho tới khi có ca vận hành thật cần thêm — route/quyền mới phát sinh theo nhu cầu cụ thể (disable org, assist refund...), mỗi route mới vẫn phải tự audit + tự dùng `withOrgScope` khi ghi, không nới rộng nguyên tắc ở mục 0.

## 8. Vì sao thiết kế này không tạo tech debt nếu chưa dùng ngay

- Migration schema/RLS ở mục 1–2 không ảnh hưởng code hiện có (bảng mới, policy mới cộng thêm — không sửa policy/bảng cũ).
- Không route nào bị gate sai — `/platform/*` tách domain hoàn toàn khỏi `/api/*`/`/public/*`/`/webhooks/*`.
- Nếu cuối cùng không cần tính năng này, xoá 2 bảng + 1 policy + 1 helper là xong, không có chỗ nào khác trong codebase phụ thuộc ngược vào nó.

## 9. Deploy — cái gì tự động, cái gì phải làm tay

**Tự động, không cần làm gì thêm:**

- Migration (bảng mới + `platformReadPolicy()`) chạy sẵn trong CI/CD, y hệt mọi migration khác — `.github/workflows/deploy-staging.yml` bước "Run DB migrations (staging Neon branch)" và `deploy-prod.yml` bước "Run DB migrations (production)" đều gọi `bunx drizzle-kit migrate` **trước** khi deploy Worker/Pages, dùng đúng `DATABASE_URL` secret của từng environment. Push lên `main` (CI xanh) → staging tự deploy + tự migrate; chạy `Deploy Production` (workflow_dispatch, cần approve) → prod tự deploy + tự migrate.
- Route `/platform`, endpoint `/platform/whoami` và `/platform/orgs` — nằm trong build/deploy bình thường của `apps/api`/`apps/dashboard`, không cần bước riêng.

**Phải làm tay, mỗi khi có 1 environment mới cần dùng `/platform` (staging lần đầu, prod lần đầu, hoặc thêm 1 staff mới):**

```bash
cd packages/db
DATABASE_URL="<lấy từ GitHub Environment secret hoặc Neon console>" \
  bun run grant-platform-staff you@example.com
```

- **Vì sao không tự động**: cố tình — cấp quyền platform-admin không nên nằm trong CI/CD (không muốn ai đó chỉ cần merge PR là tự cấp được quyền xuyên-tenant cho mình). Xem mục 6.
- **Điều kiện**: user đó phải đã signup/login vào đúng environment đó ít nhất 1 lần trước (script tra theo email trong bảng `user`, chưa có thì báo lỗi `no user with email ...`).
- **Mỗi environment tách biệt**: staging và prod là 2 database khác nhau (Neon branch riêng — `docs/runbooks/ci-cd-setup.md` mục 3) → cấp quyền ở staging không tự có ở prod, phải chạy lại lệnh trên với `DATABASE_URL` của prod.
- Idempotent — chạy lại không sao, chỉ báo "đã là staff".
