import {
  bulkDeleteCampaignsSchema,
  bulkUpdateCampaignsSchema,
  campaignAnalyticsSchema,
  campaignListQuerySchema,
  campaignListResponseSchema,
  campaignWithProductsSchema,
  createCampaignSchema,
  updateCampaignSchema
} from "@dv/contracts";
import {
  auditLogsRepository,
  campaignProductsRepository,
  campaignsRepository,
  eventsRepository,
  generateCampaignPublicId,
  leadsRepository,
  ordersRepository
} from "@dv/db";
import { Hono, type Context } from "hono";

import { createDbFromEnv } from "../../lib/db.js";
import { ApiError } from "../../lib/errors.js";
import type { AppEnv } from "../../types.js";

export const campaignsRoutes = new Hono<AppEnv>();

function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

/** Reconciled statuses only (business-analysis.md north-star: paid orders reconciled through the platform). */
const REVENUE_ORDER_STATUSES = new Set(["paid", "fulfilled"]);
const ANALYTICS_RANGE_DAYS = 30;

campaignsRoutes.get("/", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const query = campaignListQuerySchema.parse(c.req.query());

  const { rows, total } = await campaignsRepository.listPage(
    db,
    orgId,
    query.page,
    query.pageSize,
    query.search
  );
  // One batched query for every row's product ids instead of one `listForCampaign` per row.
  const links = await campaignProductsRepository.listForCampaigns(
    db,
    orgId,
    rows.map((row) => row.id)
  );
  const productIdsByCampaign = new Map<string, string[]>();
  for (const link of links) {
    const ids = productIdsByCampaign.get(link.campaignId) ?? [];
    ids.push(link.productId);
    productIdsByCampaign.set(link.campaignId, ids);
  }

  return c.json(
    campaignListResponseSchema.parse({
      campaigns: rows.map((row) => ({
        ...row,
        productIds: productIdsByCampaign.get(row.id) ?? []
      })),
      total,
      page: query.page,
      pageSize: query.pageSize
    })
  );
});

campaignsRoutes.post("/", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = createCampaignSchema.parse(await c.req.json());

  const row = await campaignsRepository.insert(db, orgId, {
    publicId: generateCampaignPublicId(body.name),
    name: body.name,
    status: body.status,
    goal: body.goal ?? null,
    startsAt: body.startsAt ?? null,
    endsAt: body.endsAt ?? null,
    formConfig: body.formConfig ?? { fields: [], popups: {} },
    paymentConfig: body.paymentConfig ?? {},
    utmDefaults: body.utmDefaults ?? {}
  });
  if (!row) throw new ApiError(500, "campaign_insert_failed");

  if (body.productIds.length > 0) {
    await campaignProductsRepository.setForCampaign(
      db,
      orgId,
      row.id,
      body.productIds
    );
  }

  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "campaign.create",
    targetType: "campaign",
    targetId: row.id,
    meta: { name: row.name }
  });

  return c.json(
    campaignWithProductsSchema.parse({ ...row, productIds: body.productIds }),
    201
  );
});

const BULK_BATCH_MAX = 500;

/** `PATCH`/`DELETE /bulk` — table multi-select bulk actions, same row-cap discipline as
 * `leadsRoutes`'s `/bulk` pair. Registered before `PATCH`/`DELETE /:id` below — same
 * single-path-segment reason as `leadsRoutes`'s `/data-subject-requests`: Hono matches routes
 * in registration order, and a literal "bulk" would otherwise be swallowed by `:id`. Ids
 * outside the caller's org are silently dropped rather than failing the whole request — the
 * response's updated/deleted count tells the caller how many actually applied. */
campaignsRoutes.patch("/bulk", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = bulkUpdateCampaignsSchema.parse(await c.req.json());
  if (body.campaignIds.length > BULK_BATCH_MAX) {
    throw new ApiError(400, "bulk_batch_too_large");
  }

  const rows = await campaignsRepository.findManyByIds(
    db,
    orgId,
    body.campaignIds
  );
  for (const row of rows) {
    // one status update at a time — same per-row shape as leadsRoutes' bulk PATCH
    // oxlint-disable-next-line no-await-in-loop, react-doctor/async-await-in-loop
    await campaignsRepository.update(db, orgId, row.id, {
      status: body.status
    });
  }

  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "campaign.bulk_update",
    targetType: "campaign",
    targetId: null,
    meta: {
      requested: body.campaignIds.length,
      updated: rows.length,
      status: body.status
    }
  });

  return c.json({ ok: true, updated: rows.length });
});

campaignsRoutes.delete("/bulk", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = bulkDeleteCampaignsSchema.parse(await c.req.json());
  if (body.campaignIds.length > BULK_BATCH_MAX) {
    throw new ApiError(400, "bulk_batch_too_large");
  }

  const rows = await campaignsRepository.findManyByIds(
    db,
    orgId,
    body.campaignIds
  );
  for (const row of rows) {
    // oxlint-disable-next-line no-await-in-loop, react-doctor/async-await-in-loop -- soft-delete, one row at a time
    await campaignsRepository.update(db, orgId, row.id, {
      deletedAt: new Date()
    });
  }

  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "campaign.bulk_delete",
    targetType: "campaign",
    targetId: null,
    meta: { requested: body.campaignIds.length, deleted: rows.length }
  });

  return c.json({ ok: true, deleted: rows.length });
});

campaignsRoutes.patch("/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = updateCampaignSchema.parse(await c.req.json());

  const existing = await campaignsRepository.findById(db, orgId, id);
  if (!existing || existing.deletedAt) {
    throw new ApiError(404, "campaign_not_found");
  }

  const { productIds, ...fields } = body;
  const updated =
    Object.keys(fields).length > 0
      ? await campaignsRepository.update(db, orgId, id, fields)
      : existing;

  if (productIds !== undefined) {
    await campaignProductsRepository.setForCampaign(db, orgId, id, productIds);
  }
  const finalProductIds =
    productIds ??
    (await campaignProductsRepository.listForCampaign(db, orgId, id)).map(
      (link) => link.productId
    );

  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "campaign.update",
    targetType: "campaign",
    targetId: id,
    meta: { fields: Object.keys(body) }
  });

  return c.json(
    campaignWithProductsSchema.parse({
      ...updated,
      productIds: finalProductIds
    })
  );
});

campaignsRoutes.delete("/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const existing = await campaignsRepository.findById(db, orgId, id);
  if (!existing || existing.deletedAt) {
    throw new ApiError(404, "campaign_not_found");
  }

  await campaignsRepository.update(db, orgId, id, { deletedAt: new Date() });
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "campaign.delete",
    targetType: "campaign",
    targetId: id,
    meta: {}
  });
  return c.body(null, 204);
});

/** Duplicate action (leads/landing-pages parity) — copies name (suffixed), product links, form
 * fields, and payment config as a new draft, same "good enough for a P1 convenience action"
 * shape as `landingsRoutes.post("/:id/duplicate")`. Always lands in `draft`, regardless of the
 * source campaign's status, so a duplicated live campaign never starts capturing leads by accident. */
campaignsRoutes.post("/:id/duplicate", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const existing = await campaignsRepository.findById(db, orgId, id);
  if (!existing || existing.deletedAt) {
    throw new ApiError(404, "campaign_not_found");
  }

  const productIds = (
    await campaignProductsRepository.listForCampaign(db, orgId, id)
  ).map((link) => link.productId);

  const row = await campaignsRepository.insert(db, orgId, {
    publicId: generateCampaignPublicId(existing.name),
    name: `${existing.name} (copy)`,
    status: "draft",
    goal: existing.goal,
    startsAt: existing.startsAt,
    endsAt: existing.endsAt,
    formConfig: existing.formConfig,
    paymentConfig: existing.paymentConfig,
    utmDefaults: existing.utmDefaults
  });
  if (!row) throw new ApiError(500, "campaign_insert_failed");

  if (productIds.length > 0) {
    await campaignProductsRepository.setForCampaign(
      db,
      orgId,
      row.id,
      productIds
    );
  }

  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "campaign.duplicate",
    targetType: "campaign",
    targetId: row.id,
    meta: { sourceCampaignId: id }
  });

  return c.json(campaignWithProductsSchema.parse({ ...row, productIds }), 201);
});

/** FR-C-05: daily views/submits/orders/reconciled-revenue for the last 30 days. */
campaignsRoutes.get("/:id/analytics", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const existing = await campaignsRepository.findById(db, orgId, id);
  if (!existing || existing.deletedAt) {
    throw new ApiError(404, "campaign_not_found");
  }

  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (ANALYTICS_RANGE_DAYS - 1));

  const [campaignEvents, campaignOrders] = await Promise.all([
    eventsRepository.listForCampaignSince(db, orgId, id, since),
    ordersRepository.listForCampaignSince(db, orgId, id, since)
  ]);

  const byDate = new Map<
    string,
    { views: number; submits: number; orders: number; revenue: number }
  >();
  for (let i = 0; i < ANALYTICS_RANGE_DAYS; i++) {
    const day = new Date(since);
    day.setUTCDate(day.getUTCDate() + i);
    byDate.set(day.toISOString().slice(0, 10), {
      views: 0,
      submits: 0,
      orders: 0,
      revenue: 0
    });
  }

  for (const event of campaignEvents) {
    const bucket = byDate.get(event.createdAt.toISOString().slice(0, 10));
    if (!bucket) continue;
    if (event.type === "view") bucket.views += 1;
    if (event.type === "submit") bucket.submits += 1;
  }

  for (const order of campaignOrders) {
    if (!REVENUE_ORDER_STATUSES.has(order.status)) continue;
    const bucket = byDate.get(order.createdAt.toISOString().slice(0, 10));
    if (!bucket) continue;
    bucket.orders += 1;
    bucket.revenue += Number(order.amount);
  }

  const days = Array.from(byDate.entries()).map(([date, stats]) => ({
    date,
    ...stats
  }));
  const totals = days.reduce(
    (acc, day) => ({
      views: acc.views + day.views,
      submits: acc.submits + day.submits,
      orders: acc.orders + day.orders,
      revenue: acc.revenue + day.revenue
    }),
    { views: 0, submits: 0, orders: 0, revenue: 0 }
  );

  const bySource = await computeAnalyticsBySource(
    db,
    orgId,
    campaignEvents,
    campaignOrders
  );

  return c.json(
    campaignAnalyticsSchema.parse({
      days,
      totals: {
        ...totals,
        conversionRate: totals.views > 0 ? totals.orders / totals.views : 0
      },
      bySource
    })
  );
});

/** No `utm_source` -> grouped under this bucket (untagged links, direct visits) rather than
 * dropped — an org still wants to see how much traffic isn't tagged at all. */
const DIRECT_SOURCE = "direct";

function utmSourceOf(meta: unknown): string {
  if (!meta || typeof meta !== "object") return DIRECT_SOURCE;
  const utm = (meta as Record<string, unknown>).utm;
  if (!utm || typeof utm !== "object") return DIRECT_SOURCE;
  const source = (utm as Record<string, unknown>).utm_source;
  return typeof source === "string" && source ? source : DIRECT_SOURCE;
}

/** Traffic-source breakdown (module review: UTM data already flows through `events.meta.utm` and
 * `leads.utm` but wasn't exposed here). Views/submits come straight off the events already fetched
 * for the daily chart above — no extra query. Orders/revenue need one extra batched lookup:
 * `orders` itself carries no UTM, only the lead it belongs to does (captured at submission time),
 * so this maps each reconciled order's `leadId` to that lead's `utm_source` via a single
 * `findManyByIds` call, the same batching shape `campaignProductsRepository.listForCampaigns`
 * uses to avoid an N+1 in the list route above. */
async function computeAnalyticsBySource(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  campaignEvents: { type: string; meta: unknown }[],
  campaignOrders: { leadId: string; status: string; amount: string }[]
) {
  const bySource = new Map<
    string,
    { views: number; submits: number; orders: number; revenue: number }
  >();
  const bucketFor = (source: string) => {
    const existing = bySource.get(source);
    if (existing) return existing;
    const fresh = { views: 0, submits: 0, orders: 0, revenue: 0 };
    bySource.set(source, fresh);
    return fresh;
  };

  for (const event of campaignEvents) {
    if (event.type !== "view" && event.type !== "submit") continue;
    const bucket = bucketFor(utmSourceOf(event.meta));
    if (event.type === "view") bucket.views += 1;
    else bucket.submits += 1;
  }

  const revenueOrders = campaignOrders.filter((order) =>
    REVENUE_ORDER_STATUSES.has(order.status)
  );
  const leads = await leadsRepository.findManyByIds(
    db,
    orgId,
    Array.from(new Set(revenueOrders.map((order) => order.leadId)))
  );
  const sourceByLeadId = new Map(
    leads.map((lead) => [lead.id, utmSourceOf({ utm: lead.utm })])
  );
  for (const order of revenueOrders) {
    const bucket = bucketFor(sourceByLeadId.get(order.leadId) ?? DIRECT_SOURCE);
    bucket.orders += 1;
    bucket.revenue += Number(order.amount);
  }

  return Array.from(bySource.entries())
    .map(([source, stats]) => ({
      source,
      ...stats,
      conversionRate: stats.views > 0 ? stats.orders / stats.views : 0
    }))
    .toSorted((a, b) => b.views - a.views);
}
