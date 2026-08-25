# 09 — Platform admin (vận hành xuyên-tenant)

Bổ sung cho architecture.md §6/§6.1 (multi-tenant & RLS). Tài liệu này thiết kế **nền móng** cho việc vận hành nội bộ xuyên nhiều tenant (support, xử lý vi phạm, xem tổng quan usage) — hiện hệ thống **không có** role nào cao hơn `owner` của 1 org (xem `packages/auth/src/permissions.ts`), mọi việc xuyên-tenant hiện chỉ làm được bằng cách connect DB tay, không audit, không kiểm soát.

## 0. Mục tiêu & phi mục tiêu

**Làm nền móng ngay** (rẻ, khó rework nếu để sau — đổi schema/RLS khi đã có data thật tốn hơn nhiều so với lúc chưa có):

- Bảng lưu ai là platform staff, tách hẳn khỏi `memberships` (memberships luôn gắn 1 org, staff thì không).
- RLS mở thêm đường đọc xuyên-tenant **an toàn** (không phá lớp phòng thủ ghi hiện có).
- Helper DB tương đương `withOrgScope` nhưng cho platform staff.
- Bảng audit riêng cho hành động platform-level.

**Cập nhật 08/2026 — quyết định chủ động mở rộng phạm vi, không còn giữ nguyên tắc "chờ nhu cầu thật" cho các mục dưới đây.** Nền tảng đã qua giai đoạn chỉ-làm-nền-móng; rà soát business/UX xác nhận không có gì ở đây nên tiếp tục ở dạng tối giản. Giữ nguyên toàn bộ nền móng đã đúng ở mục 1–7 (bảng `platform_staff`/`platform_audit_logs`, RLS chỉ-đọc, `withPlatformScope`, không có "ghi xuyên-tenant tổng quát") — mở rộng thêm role tiers, UI quản lý đầy đủ, và feature-flags-theo-subscription ở §10–12 dưới đây.

**Vẫn giữ nguyên tắc, không đổi** (đây là nguyên tắc an toàn, không phải "cắt MVP"):

- App riêng (`apps/admin`) — dùng route-group trong `apps/api`/`apps/dashboard` hiện có; tách app chỉ khi có lý do cụ thể (team riêng, cần isolate deploy/security domain) — chưa có lý do đó.
- "Ghi xuyên-tenant tổng quát" (kiểu god-mode update mọi bảng) — mọi hành động ghi (disable org, hoàn tiền hộ...) vẫn phải là 1 endpoint nghiệp vụ cụ thể, tự gọi `withOrgScope(targetOrgId, ...)` bình thường + ghi audit, không có đường ghi "không cần org context". Mở rộng role/quyền ở §10 không thay đổi nguyên tắc này — role mới chỉ mở thêm _endpoint nghiệp vụ cụ thể nào_ mỗi role được gọi, không mở "ghi tự do".

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

## 10. Phân cấp role platform (mở rộng từ 1 role)

```ts
// packages/db/src/schema/platform.ts — mở rộng enum đã có, không đổi bảng
export const platformStaff = pgTable("platform_staff", {
  id: id(),
  userId: text("user_id").notNull().unique(),
  role: text("role", {
    enum: ["support", "billing_ops", "platform_admin"]
  }).notNull(),
  ...timestamps
});
```

- `support`: đọc xuyên-tenant (dùng `withPlatformScope` như hiện có) — xem chi tiết 1 org, lịch sử lead/campaign để hỗ trợ ticket. Không có quyền ghi (disable org, refund).
- `billing_ops`: đọc + 1 nhóm endpoint ghi hẹp, cụ thể — "assist refund" (gọi thẳng driver payment đã có qua `withOrgScope(targetOrgId, ...)`, không phải ghi tự do), xem tổng quan usage/cost AI credit xuyên-tenant.
- `platform_admin`: mọi quyền của 2 role trên + disable/enable org, cấp/thu hồi platform staff khác (qua UI thay vì chỉ CLI — xem mục 11).

Middleware `requirePlatformStaff` thêm tham số role tối thiểu: `requirePlatformStaff("support")` cho phép cả 3 role (thứ tự quyền support < billing_ops < platform_admin), `requirePlatformStaff("platform_admin")` chỉ role cao nhất. Không đổi cơ chế RLS/audit ở mục 2–4 — role chỉ quyết định endpoint nào được gọi, không đổi cách đọc/ghi dữ liệu.

## 11. Super admin dashboard — mở rộng UI thật

Vẫn route `/platform` trong `apps/dashboard` (không tách `apps/admin`), nhưng UI đầy đủ thay vì chỉ list-org:

- Org list + detail: filter theo trạng thái (active/disabled), search theo tên/email owner, click vào 1 org → tab Overview (thành viên, campaign count, lead count, ngày tạo), tab Billing (subscription plan hiện tại, lịch sử thanh toán, usage AI credit), tab Audit (log hành động platform-level đã tác động lên org này — join `platformAuditLogs.targetOrgId`).
- Hành động ghi (role `platform_admin`/`billing_ops` tuỳ hành động, mỗi hành động là 1 endpoint nghiệp vụ cụ thể như nguyên tắc ở mục 0):
  - `POST /platform/orgs/:id/disable` / `/enable` — khoá đăng nhập cho mọi member của org (không xoá dữ liệu), dùng khi vi phạm ToS hoặc quá hạn thanh toán dài ngày.
  - `POST /platform/orgs/:id/refund-assist` — gọi driver payment hiện có thay mặt org (billing_ops), luôn ghi `platformAuditLogs` kèm lý do (bắt buộc nhập, không optional).
  - `PATCH /platform/orgs/:id/subscription` — đổi plan/feature-flag override cho 1 org cụ thể (xem mục 12) — dùng khi sale/support cần bật thử 1 feature cho 1 khách hàng trước khi họ tự nâng cấp.
- Tổng quan xuyên-tenant (dashboard, không phải theo từng org): tổng usage AI credit theo ngày/tuần (phát hiện org nào burn bất thường), tổng số org theo từng subscription plan, danh sách org sắp hết trial/quá hạn thanh toán.
- Vẫn dùng `@dv/ui` (shadcn) như mọi trang khác, không viết design system riêng cho `/platform`.

## 12. Feature flags theo subscription — bảng mới

```ts
// packages/db/src/schema/billing.ts (cạnh bảng subscription/payment hiện có, không tạo file rời)
export const featureFlags = pgTable("feature_flags", {
  id: id(),
  key: text("key").notNull().unique(), // "ab_testing", "custom_domain", "media_upload_video"...
  description: text("description").notNull(),
  ...timestamps
});

export const planFeatures = pgTable(
  "plan_features",
  {
    id: id(),
    planId: text("plan_id").notNull(), // ref subscriptionPlans (bảng billing hiện có/sắp có)
    featureKey: text("feature_key").notNull(), // ref featureFlags.key
    ...timestamps
  },
  (t) => [uniqueIndex("ux_plan_feature").on(t.planId, t.featureKey)]
);

// Override riêng cho 1 org — dùng cho case "bật thử 1 tính năng cho khách hàng cụ thể" ở
// mục 11, hoặc "org này bị tắt tạm 1 tính năng vì lạm dụng". Ưu tiên cao hơn plan_features.
export const orgFeatureOverrides = pgTable(
  "org_feature_overrides",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    featureKey: text("feature_key").notNull(),
    enabled: text("enabled").notNull(), // "true" | "false"
    reason: text("reason").notNull(), // bắt buộc — mọi override phải giải thích được vì sao
    ...timestamps
  },
  (t) => [uniqueIndex("ux_org_feature").on(t.orgId, t.featureKey)]
);
```

Check tại runtime — 1 helper duy nhất, dùng cả ở API middleware lẫn dashboard:

```ts
// packages/db/src/feature-flags.ts
export async function hasFeature(
  db: Db,
  orgId: string,
  key: string
): Promise<boolean> {
  const override = await orgFeatureOverridesRepository.find(db, orgId, key);
  if (override) return override.enabled === "true";
  const plan = await organizationsRepository.getPlan(db, orgId);
  return planFeaturesRepository.has(db, plan.id, key);
}
```

Enforcement: middleware `requireFeature(key)` chặn ở tầng API cho endpoint gắn với tính năng trả phí (vd A/B testing — chặn 403 kèm message rõ "cần nâng cấp plan X"); dashboard ẩn/khoá UI tương ứng (nút khoá 🔒 + link nâng cấp thay vì biến mất hoàn toàn — người dùng cần biết tính năng tồn tại để có động lực nâng cấp).

Không xây ngay (ranh giới hợp lý, khác các mục đã "không còn MVP" ở trên — chờ có ≥2 plan trả phí thật mới cần): UI tự-phục-vụ cho tenant tự đổi plan (checkout flow) — hiện đủ dùng bằng `PATCH /platform/orgs/:id/subscription` (mục 11) do platform staff thao tác thủ công khi có khách hàng ký hợp đồng.
