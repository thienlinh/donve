import {
  assignLeadSchema,
  campaignPaymentConfigSchema,
  createDataSubjectRequestSchema,
  createLeadActivitySchema,
  dataSubjectRequestListSchema,
  dataSubjectRequestSchema,
  dataSubjectRequestStatusSchema,
  leadDetailSchema,
  leadImportRequestSchema,
  leadImportResultSchema,
  leadListQuerySchema,
  leadListResponseSchema,
  leadSchema,
  orgSettingsSchema,
  salesConfigListSchema,
  salesConfigSchema,
  updateLeadOrderStatusSchema,
  updateLeadStageSchema,
  updateSalesConfigSchema
} from "@dv/contracts";
import {
  auditLogsRepository,
  campaignsRepository,
  dataSubjectRequestsRepository,
  emailLogsRepository,
  leadActivitiesRepository,
  leadsRepository,
  membershipsRepository,
  ordersRepository,
  organizationsRepository,
  type Db
} from "@dv/db";
import { email, realtime } from "@dv/drivers";
import { Hono, type Context } from "hono";
import { streamSSE } from "hono/streaming";

import { createDbFromEnv } from "../../lib/db.js";
import { ApiError } from "../../lib/errors.js";
import { log } from "../../lib/logger.js";
import { normalizeVnPhone } from "../../lib/phone.js";
import {
  leadStreamChannel,
  orderStreamChannel,
  publishNewLeads,
  publishOrderUpdate
} from "../../lib/realtime.js";
import type { AppEnv } from "../../types.js";
import { findOrCreateLead } from "../public/routes.js";

export const leadsRoutes = new Hono<AppEnv>();

function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

interface PipelineStage {
  key: string;
  label: string;
  color: string;
}

/** FR-E-02 default — used until an org customizes `organizations.settings.pipeline`. */
const DEFAULT_PIPELINE: PipelineStage[] = [
  { key: "new", label: "Mới", color: "#64748b" },
  { key: "contacted", label: "Đã liên hệ", color: "#3b82f6" },
  { key: "interested", label: "Quan tâm", color: "#f59e0b" },
  { key: "won", label: "Chốt", color: "#22c55e" },
  { key: "lost", label: "Huỷ", color: "#ef4444" }
];

async function getPipeline(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string
): Promise<PipelineStage[]> {
  const org = await organizationsRepository.findById(db, orgId);
  const settings = orgSettingsSchema.parse(org?.settings ?? {});
  return settings.pipeline && settings.pipeline.length > 0
    ? settings.pipeline
    : DEFAULT_PIPELINE;
}

/** FR-E-04 — sales without `seeAllLeads` only ever see their own assigned leads. */
function scopedAssigneeFilter(c: Context<AppEnv>, requested?: string) {
  const role = c.get("membershipRole");
  const salesConfig = c.get("salesConfig");
  if (role === "sales" && !salesConfig.seeAllLeads) return c.get("userId");
  return requested;
}

/** architecture.md §5.3: dashboard SSE hub — Upstash pub/sub fanned out per-connection as SSE,
 * so a sales rep sees an order flip to `paid`/`fulfilled` without polling or refreshing. */
leadsRoutes.get("/orders/stream", async (c) => {
  const orgId = requireOrgId(c);
  const driver = realtime.createUpstashRealtimeDriver({
    url: c.env.UPSTASH_REDIS_URL,
    token: c.env.UPSTASH_REDIS_TOKEN
  });

  return streamSSE(c, async (stream) => {
    const controller = new AbortController();
    stream.onAbort(() => controller.abort());

    for await (const message of driver.subscribe(
      orderStreamChannel(orgId),
      controller.signal
    )) {
      await stream.writeSSE({ data: JSON.stringify(message.data) });
    }
  });
});

/** module E finding #4: in-app realtime bell — same Upstash-pub/sub-fanned-to-SSE shape as
 * `/orders/stream` above, just a different channel (new-lead counts, not order transitions). */
leadsRoutes.get("/stream", async (c) => {
  const orgId = requireOrgId(c);
  const driver = realtime.createUpstashRealtimeDriver({
    url: c.env.UPSTASH_REDIS_URL,
    token: c.env.UPSTASH_REDIS_TOKEN
  });

  return streamSSE(c, async (stream) => {
    const controller = new AbortController();
    stream.onAbort(() => controller.abort());

    for await (const message of driver.subscribe(
      leadStreamChannel(orgId),
      controller.signal
    )) {
      await stream.writeSSE({ data: JSON.stringify(message.data) });
    }
  });
});

leadsRoutes.get("/pipeline", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  return c.json({ stages: await getPipeline(db, orgId) });
});

leadsRoutes.get("/", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const query = leadListQuerySchema.parse(c.req.query());

  const { rows, total } = await leadsRepository.listFiltered(db, orgId, {
    ...query,
    assigneeId: scopedAssigneeFilter(c, query.assigneeId)
  });

  return c.json(
    leadListResponseSchema.parse({
      leads: rows,
      total,
      page: query.page,
      pageSize: query.pageSize
    })
  );
});

function csvCell(value: string | null): string {
  const s = value ?? "";
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const EXPORT_COLUMNS = [
  "id",
  "fullName",
  "phone",
  "email",
  "stage",
  "assigneeId",
  "campaignId",
  "createdAt"
] as const;

/** FR-E-07 — CSV export honoring the same filters as `GET /`, minus pagination. */
leadsRoutes.get("/export", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const query = leadListQuerySchema.parse(c.req.query());

  const rows = await leadsRepository.listForExport(db, orgId, {
    ...query,
    assigneeId: scopedAssigneeFilter(c, query.assigneeId)
  });

  const lines = [
    EXPORT_COLUMNS.join(","),
    ...rows.map((row) =>
      EXPORT_COLUMNS.map((col) =>
        csvCell(col === "createdAt" ? row.createdAt.toISOString() : row[col])
      ).join(",")
    )
  ];

  c.header("Content-Type", "text/csv; charset=utf-8");
  c.header(
    "Content-Disposition",
    `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`
  );
  return c.body(lines.join("\r\n"));
});

/** module E finding #3 — CSV import counterpart to `/export`. Reuses the exact same
 * race-safe dedupe-by-phone upsert (`findOrCreateLead`) the public lead-submission form
 * uses, so an imported row that matches an existing phone merges instead of duplicating. */
leadsRoutes.post("/import", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = leadImportRequestSchema.parse(await c.req.json());

  const campaign = await campaignsRepository.findById(
    db,
    orgId,
    body.campaignId
  );
  if (!campaign || campaign.deletedAt) {
    throw new ApiError(404, "campaign_not_found");
  }

  let created = 0;
  let merged = 0;
  const failed: { row: number; reason: string }[] = [];

  for (const [index, row] of body.rows.entries()) {
    const phone = normalizeVnPhone(row.phone);
    if (!phone) {
      failed.push({ row: index, reason: "invalid_phone" });
      continue;
    }
    try {
      // each row's dedupe check depends on any earlier row for the same phone already
      // having committed, can't run in parallel
      // oxlint-disable-next-line no-await-in-loop, react-doctor/async-await-in-loop
      const { merged: wasMerged } = await findOrCreateLead(
        db,
        {
          orgId,
          fullName: row.fullName,
          email: row.email ?? null,
          persona: row.persona ?? null,
          customFields: row.customFields,
          utm: {}
        },
        campaign,
        phone
      );
      if (wasMerged) merged++;
      else created++;
    } catch (err) {
      failed.push({
        row: index,
        reason: err instanceof Error ? err.message : "unknown_error"
      });
    }
  }

  if (created > 0) await publishNewLeads(c.env, orgId, created);
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.import",
    targetType: "campaign",
    targetId: campaign.id,
    meta: { created, merged, failed: failed.length }
  });

  return c.json(leadImportResultSchema.parse({ created, merged, failed }));
});

/** Org-wide list (no `:leadId`) — feeds the top-bar overdue/due-soon indicator. Must be
 * registered before `GET /:id` below — Hono matches routes in registration order, and a
 * single path segment like "data-subject-requests" would otherwise be swallowed by `:id`
 * (found live: this exact route 404'd as `lead_not_found` before being moved here). */
leadsRoutes.get("/data-subject-requests", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const statusParam = c.req.query("status");
  const status = statusParam
    ? dataSubjectRequestStatusSchema.parse(statusParam)
    : undefined;

  const rows = await dataSubjectRequestsRepository.listByStatus(
    db,
    orgId,
    status
  );
  return c.json(
    dataSubjectRequestListSchema.parse({ dataSubjectRequests: rows })
  );
});

async function findVisibleLead(
  c: Context<AppEnv>,
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  id: string
) {
  const lead = await leadsRepository.findById(db, orgId, id);
  if (!lead || lead.deletedAt) throw new ApiError(404, "lead_not_found");

  const role = c.get("membershipRole");
  const salesConfig = c.get("salesConfig");
  if (
    role === "sales" &&
    !salesConfig.seeAllLeads &&
    lead.assigneeId !== c.get("userId")
  ) {
    throw new ApiError(404, "lead_not_found");
  }
  return lead;
}

leadsRoutes.get("/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const lead = await findVisibleLead(c, db, orgId, id);
  const [activities, orders, campaign] = await Promise.all([
    leadActivitiesRepository.listForLead(db, orgId, id),
    ordersRepository.listForLead(db, orgId, id),
    campaignsRepository.findById(db, orgId, lead.campaignId)
  ]);

  return c.json(
    leadDetailSchema.parse({
      lead,
      activities,
      orders,
      campaign: campaign ? { id: campaign.id, name: campaign.name } : null
    })
  );
});

leadsRoutes.patch("/:id/stage", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = updateLeadStageSchema.parse(await c.req.json());

  const [lead, pipeline] = await Promise.all([
    findVisibleLead(c, db, orgId, id),
    getPipeline(db, orgId)
  ]);
  if (!pipeline.some((stage) => stage.key === body.stage)) {
    throw new ApiError(400, "invalid_stage");
  }

  const updated = await leadsRepository.update(db, orgId, id, {
    stage: body.stage
  });
  await leadActivitiesRepository.insert(db, orgId, {
    leadId: id,
    type: "stage_change",
    body: null,
    meta: { from: lead.stage, to: body.stage },
    actorId: c.get("userId")
  });
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.stage_change",
    targetType: "lead",
    targetId: id,
    meta: { from: lead.stage, to: body.stage }
  });

  return c.json(leadSchema.parse(updated));
});

leadsRoutes.patch("/:id/assignee", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = assignLeadSchema.parse(await c.req.json());

  const lead = await findVisibleLead(c, db, orgId, id);
  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- visibility check must throw before this write fires, not run alongside it
  const updated = await leadsRepository.update(db, orgId, id, {
    assigneeId: body.assigneeId
  });
  await leadActivitiesRepository.insert(db, orgId, {
    leadId: id,
    type: "system",
    body: null,
    meta: { from: lead.assigneeId, to: body.assigneeId, kind: "assignment" },
    actorId: c.get("userId")
  });
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.assignee_change",
    targetType: "lead",
    targetId: id,
    meta: { from: lead.assigneeId, to: body.assigneeId }
  });

  return c.json(leadSchema.parse(updated));
});

leadsRoutes.post("/:id/activities", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = createLeadActivitySchema.parse(await c.req.json());

  await findVisibleLead(c, db, orgId, id);
  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- the visibility
  // check must complete (and possibly throw) BEFORE the write fires, not alongside it.
  const activity = await leadActivitiesRepository.insert(db, orgId, {
    leadId: id,
    type: body.type,
    body: body.body,
    meta: {},
    actorId: c.get("userId")
  });

  return c.json(activity, 201);
});

/** Allowed transitions for FR-E-05 quick actions — everything else (refund, dispute) routes
 * through the dedicated flows in FR-D-11..14, not this generic endpoint. */
const ALLOWED_ORDER_TRANSITIONS: Record<string, string[]> = {
  pending: ["awaiting_confirmation", "paid", "cancelled"],
  awaiting_confirmation: ["paid", "cancelled"],
  paid: ["fulfilled"]
};

/** FR-I-04 — best-effort: a failed send must not undo the (already persisted) status change. */
async function maybeSendOrderConfirmationEmail(
  db: Db,
  env: { RESEND_API_KEY: string },
  orgId: string,
  order: { id: string; code: string; campaignId: string; amount: string },
  status: "paid" | "fulfilled",
  leadEmail: string | null
): Promise<void> {
  if (!env.RESEND_API_KEY || !leadEmail) return;

  const campaign = await campaignsRepository.findById(
    db,
    orgId,
    order.campaignId
  );
  const paymentConfig = campaignPaymentConfigSchema.parse(
    campaign?.paymentConfig
  );
  if (!paymentConfig.emailConfirmationEnabled) return;

  try {
    const sender = email.createResendEmailSender({
      apiKey: env.RESEND_API_KEY
    });
    const result = await sender.send({
      to: leadEmail,
      template: "order_confirmation",
      props: { orderCode: order.code, status, amount: Number(order.amount) }
    });
    await emailLogsRepository.insert(db, {
      orgId,
      to: leadEmail,
      template: "order_confirmation",
      resendId: result.id,
      status: "sent"
    });
  } catch (err) {
    log("error", {
      requestId: "order-confirmation-email",
      orgId,
      message: "order confirmation email failed",
      error: err instanceof Error ? err.message : String(err)
    });
  }
}

leadsRoutes.patch("/:id/orders/:orderId", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const orderId = c.req.param("orderId");
  const body = updateLeadOrderStatusSchema.parse(await c.req.json());

  const lead = await findVisibleLead(c, db, orgId, id);
  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- visibility check must throw before this read fires, not run alongside it
  const order = await ordersRepository.findById(db, orgId, orderId);
  if (!order || order.leadId !== id) throw new ApiError(404, "order_not_found");

  const allowed = ALLOWED_ORDER_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(body.status)) {
    throw new ApiError(400, "invalid_order_transition");
  }

  const now = new Date();
  const updated = await ordersRepository.update(db, orgId, orderId, {
    status: body.status,
    paidAt: body.status === "paid" ? now : order.paidAt,
    fulfilledAt: body.status === "fulfilled" ? now : order.fulfilledAt
  });
  if (updated) await publishOrderUpdate(c.env, orgId, updated);
  // FR-D-08: every sales-driven status change logs its reason.
  await leadActivitiesRepository.insert(db, orgId, {
    leadId: id,
    type: body.status === "paid" ? "payment" : "system",
    body: null,
    meta: { orderId, from: order.status, to: body.status, reason: body.reason },
    actorId: c.get("userId")
  });
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "order.status_change",
    targetType: "order",
    targetId: orderId,
    meta: { from: order.status, to: body.status, reason: body.reason }
  });

  if (body.status === "paid" || body.status === "fulfilled") {
    await maybeSendOrderConfirmationEmail(
      db,
      c.env,
      orgId,
      order,
      body.status,
      lead.email
    );
  }

  return c.json(updated);
});

/** NFR-10 — right to erasure/rectification (Nghị định 13/2023/NĐ-CP). Ops triggers this once a
 * deletion/export request (received by email, 72h SLA — no in-app intake flow) is verified;
 * orders/payments are left intact as accounting evidence per NFR-11. Owner/admin only. */
leadsRoutes.post("/:id/anonymize", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const role = c.get("membershipRole");
  if (role !== "owner" && role !== "admin")
    throw new ApiError(403, "forbidden");

  const lead = await findVisibleLead(c, db, orgId, id);
  if (lead.anonymizedAt) return c.json(leadSchema.parse(lead));

  const updated = await leadsRepository.anonymize(db, orgId, id);
  await leadActivitiesRepository.insert(db, orgId, {
    leadId: id,
    type: "system",
    body: null,
    meta: { kind: "anonymized" },
    actorId: c.get("userId")
  });
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.anonymize",
    targetType: "lead",
    targetId: id,
    meta: {}
  });

  return c.json(leadSchema.parse(updated));
});

const DSR_SLA_HOURS = 72;

/** NFR-10 (Nghị định 13/2023/NĐ-CP) — a lead's delete/export request, logged from the lead
 * detail sheet against the org's own 72h response SLA (NFR-12: the org is the data
 * controller, not the platform — there is no in-app intake from the lead's side). */
leadsRoutes.post("/:id/data-subject-requests", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = createDataSubjectRequestSchema.parse(await c.req.json());

  await findVisibleLead(c, db, orgId, id);
  const receivedAt = body.receivedAt ?? new Date();
  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- visibility check must throw before this write fires, not run alongside it
  const created = await dataSubjectRequestsRepository.insert(db, orgId, {
    leadId: id,
    requestType: body.requestType,
    receivedAt,
    dueAt: new Date(receivedAt.getTime() + DSR_SLA_HOURS * 60 * 60 * 1000),
    notes: body.notes ?? null
  });
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.data_subject_request_create",
    targetType: "lead",
    targetId: id,
    meta: { requestType: body.requestType }
  });

  return c.json(dataSubjectRequestSchema.parse(created), 201);
});

leadsRoutes.get("/:id/data-subject-requests", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  await findVisibleLead(c, db, orgId, id);
  const rows = await dataSubjectRequestsRepository.listForLead(db, orgId, id);
  return c.json(
    dataSubjectRequestListSchema.parse({ dataSubjectRequests: rows })
  );
});

leadsRoutes.patch("/:id/data-subject-requests/:requestId", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const requestId = c.req.param("requestId");

  await findVisibleLead(c, db, orgId, id);
  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- visibility check must throw before this read fires, not run alongside it
  const existing = await dataSubjectRequestsRepository.findById(
    db,
    orgId,
    requestId
  );
  if (!existing || existing.leadId !== id) {
    throw new ApiError(404, "data_subject_request_not_found");
  }

  const updated = await dataSubjectRequestsRepository.complete(
    db,
    orgId,
    requestId
  );
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.data_subject_request_complete",
    targetType: "lead",
    targetId: id,
    meta: { requestId }
  });

  return c.json(dataSubjectRequestSchema.parse(updated));
});

/** FR-E-04 — owner/admin reads current `seeAllLeads` per sales member, to render the toggle. */
leadsRoutes.get("/members/sales-config", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);

  const role = c.get("membershipRole");
  if (role !== "owner" && role !== "admin")
    throw new ApiError(403, "forbidden");

  const salesMembers = await membershipsRepository.listByRole(
    db,
    orgId,
    "sales"
  );
  return c.json(
    salesConfigListSchema.parse({
      members: salesMembers.map((member) => ({
        membershipId: member.id,
        userId: member.userId,
        seeAllLeads: Boolean(
          salesConfigSchema.parse(member.salesConfig ?? {}).seeAllLeads
        )
      }))
    })
  );
});

/** FR-E-04 — owner/admin toggles whether a sales member sees all org leads or only their own. */
leadsRoutes.patch("/members/:membershipId/sales-config", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const membershipId = c.req.param("membershipId");
  const body = updateSalesConfigSchema.parse(await c.req.json());

  const role = c.get("membershipRole");
  if (role !== "owner" && role !== "admin")
    throw new ApiError(403, "forbidden");

  const membership = await membershipsRepository.findById(
    db,
    orgId,
    membershipId
  );
  if (!membership) throw new ApiError(404, "membership_not_found");

  const updated = await membershipsRepository.update(db, orgId, membershipId, {
    salesConfig: {
      ...salesConfigSchema.parse(membership.salesConfig ?? {}),
      seeAllLeads: body.seeAllLeads
    }
  });

  return c.json({ salesConfig: updated?.salesConfig ?? {} });
});
