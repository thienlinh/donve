import {
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
    query.pageSize
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

  return c.json(
    campaignAnalyticsSchema.parse({
      days,
      totals: {
        ...totals,
        conversionRate: totals.views > 0 ? totals.orders / totals.views : 0
      }
    })
  );
});
