import {
  featureFlagSchema,
  orgFeatureOverrideSchema,
  organizationSchema,
  platformAuditLogSchema,
  platformOrgDetailSchema,
  platformOrgListItemSchema,
  platformReasonSchema,
  platformRefundAssistSchema,
  platformSubscriptionUpdateSchema,
  platformWhoAmISchema,
  refundRequestSchema
} from "@dv/contracts";
import {
  featureFlagsRepository,
  ordersRepository,
  orgFeatureOverridesRepository,
  organizationsRepository,
  paymentsRepository,
  planFeaturesRepository,
  platformAuditLogsRepository,
  refundRequestsRepository
} from "@dv/db";
import { Hono } from "hono";
import { z } from "zod";

import { createDbFromEnv } from "../../lib/db.js";
import { ApiError } from "../../lib/errors.js";
import { runLegacyImportMigration } from "../../lib/legacy-import-migration.js";
import { requirePlatformStaff } from "../../middleware/require-platform-staff.js";
import type { AppEnv } from "../../types.js";

/**
 * `/platform/*` routes (docs/architecture/platform-admin.md §7/§11). Every handler that reads
 * tenant data records a `platform_audit_logs` row before responding — not optional
 * (platform-admin.md §4). `/whoami` is exempt: it exposes no tenant data, just confirms staff
 * identity, and the dashboard calls it on every navigation to `/platform` — logging that would
 * just be noise diluting the audit trail for actual cross-tenant reads.
 *
 * The whole group is already gated at `support` level in app.ts; the write endpoints re-apply
 * `requirePlatformStaff` with the higher role each one needs (§10). None of them writes
 * "as platform admin": tenant-data writes go through `withOrgScope(targetOrgId, ...)` inside the
 * repositories, exactly like the tenant's own endpoints do (§0 — no cross-tenant write path).
 */
export const platformRoutes = new Hono<AppEnv>();

platformRoutes.get("/whoami", (c) =>
  c.json(
    platformWhoAmISchema.parse({
      staffId: c.get("platformStaffId"),
      role: c.get("platformStaffRole")
    })
  )
);

platformRoutes.get("/orgs", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgs = await organizationsRepository.listAll(db);

  await platformAuditLogsRepository.record(db, {
    staffUserId: c.get("platformStaffId"),
    action: "org.list",
    targetOrgId: null,
    targetType: "organization",
    targetId: null,
    meta: null
  });

  return c.json({ orgs: z.array(platformOrgListItemSchema).parse(orgs) });
});

/** Org detail — the Overview/Billing/Audit tabs (platform-admin.md §11) in one round trip. */
platformRoutes.get("/orgs/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = c.req.param("id");

  const org = await organizationsRepository.findById(db, orgId);
  if (!org) throw new ApiError(404, "org_not_found");

  const [stats, planFeatures, featureOverrides, availableFeatures, auditLogs] =
    await Promise.all([
      organizationsRepository.statsForOrg(db, orgId),
      planFeaturesRepository.listForPlan(db, org.plan),
      orgFeatureOverridesRepository.list(db, orgId),
      featureFlagsRepository.listAll(db),
      platformAuditLogsRepository.listForOrg(db, orgId)
    ]);

  await platformAuditLogsRepository.record(db, {
    staffUserId: c.get("platformStaffId"),
    action: "org.view",
    targetOrgId: orgId,
    targetType: "organization",
    targetId: orgId,
    meta: null
  });

  return c.json(
    platformOrgDetailSchema.parse({
      org,
      stats,
      planFeatureKeys: planFeatures.map((row) => row.featureKey),
      featureOverrides,
      availableFeatures: z.array(featureFlagSchema).parse(availableFeatures),
      auditLogs: z.array(platformAuditLogSchema).parse(auditLogs)
    })
  );
});

/**
 * Locks every member of the org out of `/api/*` (`require-org-session.ts` checks `disabledAt`)
 * without deleting anything — ToS violation or long-overdue payment (platform-admin.md §11).
 * `organizations` is the tenant-boundary record itself and carries no RLS, so this uses the
 * plain repository like `create`/`update` everywhere else do (see repositories/organizations.ts);
 * `withOrgScope` applies to tenant *data* writes, which the two endpoints below do use.
 */
platformRoutes.post(
  "/orgs/:id/disable",
  requirePlatformStaff("platform_admin"),
  async (c) => {
    const db = createDbFromEnv(c.env);
    const orgId = c.req.param("id");
    const { reason } = platformReasonSchema.parse(await c.req.json());

    const org = await organizationsRepository.findById(db, orgId);
    if (!org) throw new ApiError(404, "org_not_found");

    const updated = await organizationsRepository.update(db, orgId, {
      disabledAt: new Date()
    });

    await platformAuditLogsRepository.record(db, {
      staffUserId: c.get("platformStaffId"),
      action: "org.disable",
      targetOrgId: orgId,
      targetType: "organization",
      targetId: orgId,
      meta: JSON.stringify({ reason })
    });

    return c.json(organizationSchema.parse(updated));
  }
);

platformRoutes.post(
  "/orgs/:id/enable",
  requirePlatformStaff("platform_admin"),
  async (c) => {
    const db = createDbFromEnv(c.env);
    const orgId = c.req.param("id");
    const { reason } = platformReasonSchema.parse(await c.req.json());

    const org = await organizationsRepository.findById(db, orgId);
    if (!org) throw new ApiError(404, "org_not_found");

    const updated = await organizationsRepository.update(db, orgId, {
      disabledAt: null
    });

    await platformAuditLogsRepository.record(db, {
      staffUserId: c.get("platformStaffId"),
      action: "org.enable",
      targetOrgId: orgId,
      targetType: "organization",
      targetId: orgId,
      meta: JSON.stringify({ reason })
    });

    return c.json(organizationSchema.parse(updated));
  }
);

/**
 * Opens a refund request on the tenant's behalf when support/billing has to step in
 * (platform-admin.md §11). Same non-custodial shape as the tenant's own
 * `POST /api/payments/orders/:orderId/refund-requests`: the platform never holds funds, so this
 * only creates the tracking record the FR-D-12 checklist screen works from — `remitterInfo` is
 * left empty for that screen to fill in, and no payment driver is called (there is nothing to
 * call: SePay's flow is a manual bank transfer by the tenant).
 */
platformRoutes.post(
  "/orgs/:id/refund-assist",
  requirePlatformStaff("billing_ops"),
  async (c) => {
    const db = createDbFromEnv(c.env);
    const orgId = c.req.param("id");
    const body = platformRefundAssistSchema.parse(await c.req.json());

    const order = await ordersRepository.findById(db, orgId, body.orderId);
    if (!order) throw new ApiError(404, "order_not_found");
    if (order.status !== "paid" && order.status !== "fulfilled") {
      throw new ApiError(400, "order_not_refundable");
    }

    const payment = await paymentsRepository.findLatestForOrder(
      db,
      orgId,
      body.orderId
    );

    // withOrgScope(orgId, ...) inside the repository — the target org's own write path.
    const created = await refundRequestsRepository.insert(db, orgId, {
      orderId: body.orderId,
      paymentId: payment?.id ?? null,
      reason: body.refundReason,
      amount: order.amount,
      status: "pending",
      // Not a member of this org — the acting staff is recorded in the platform audit log below.
      createdBy: null
    });

    await platformAuditLogsRepository.record(db, {
      staffUserId: c.get("platformStaffId"),
      action: "refund.assist",
      targetOrgId: orgId,
      targetType: "refund_request",
      targetId: created?.id ?? null,
      meta: JSON.stringify({
        reason: body.reason,
        refundReason: body.refundReason,
        orderId: body.orderId
      })
    });

    return c.json(refundRequestSchema.parse(created), 201);
  }
);

/**
 * Plan change and/or per-org feature overrides (platform-admin.md §11/§12) — how a signed
 * contract or an early-access trial gets applied until tenant self-serve checkout exists.
 * `enabled: null` deletes the override so the org falls back to its plan's feature set.
 */
platformRoutes.patch(
  "/orgs/:id/subscription",
  requirePlatformStaff("billing_ops"),
  async (c) => {
    const db = createDbFromEnv(c.env);
    const orgId = c.req.param("id");
    const body = platformSubscriptionUpdateSchema.parse(await c.req.json());

    const org = await organizationsRepository.findById(db, orgId);
    if (!org) throw new ApiError(404, "org_not_found");

    if (body.plan && body.plan !== org.plan) {
      await organizationsRepository.update(db, orgId, { plan: body.plan });
    }

    await Promise.all(
      (body.featureOverrides ?? []).map((override) =>
        override.enabled === null
          ? orgFeatureOverridesRepository.remove(db, orgId, override.featureKey)
          : orgFeatureOverridesRepository.upsert(db, orgId, {
              featureKey: override.featureKey,
              enabled: override.enabled ? "true" : "false",
              reason: body.reason
            })
      )
    );

    await platformAuditLogsRepository.record(db, {
      staffUserId: c.get("platformStaffId"),
      action: "org.subscription_update",
      targetOrgId: orgId,
      targetType: "organization",
      targetId: orgId,
      meta: JSON.stringify({
        reason: body.reason,
        plan: body.plan ?? null,
        featureOverrides: body.featureOverrides ?? []
      })
    });

    const [updated, featureOverrides] = await Promise.all([
      organizationsRepository.findById(db, orgId),
      orgFeatureOverridesRepository.list(db, orgId)
    ]);

    return c.json({
      org: organizationSchema.parse(updated),
      featureOverrides: z
        .array(orgFeatureOverrideSchema)
        .parse(featureOverrides)
    });
  }
);

// `roadmap/roadmap.md` §Migration dữ liệu cũ — operator-triggered, idempotent, no downtime
// (every affected page keeps serving from its existing `pageVersions.htmlKey` throughout;
// this only changes `landingPages.source` + backfills `customPageBundles`).
platformRoutes.post(
  "/migrate-legacy-imports",
  requirePlatformStaff("platform_admin"),
  async (c) => {
    const db = createDbFromEnv(c.env);
    const result = await runLegacyImportMigration(c.env);

    await platformAuditLogsRepository.record(db, {
      staffUserId: c.get("platformStaffId"),
      action: "landing_pages.migrate_legacy_imports",
      targetOrgId: null,
      targetType: "landing_page",
      targetId: null,
      meta: JSON.stringify({ migrated: result.migrated })
    });

    return c.json(result);
  }
);
