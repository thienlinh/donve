import {
  campaignPaymentConfigSchema,
  confirmOrderTransferResultSchema,
  publicLeadResultSchema,
  publicLeadSubmitSchema,
  publicOrderStatusSchema,
  type PublicLeadSubmitInput
} from "@dv/contracts";
import {
  campaignsRepository,
  consentsRepository,
  leadActivitiesRepository,
  leadsRepository,
  membershipsRepository,
  ordersRepository,
  productsRepository
} from "@dv/db";
import { payments } from "@dv/drivers";
import { Hono } from "hono";

import { clientIp } from "../../lib/client-ip.js";
import { createDbFromEnv } from "../../lib/db.js";
import { ApiError } from "../../lib/errors.js";
import { normalizeVnPhone } from "../../lib/phone.js";
import { publishNewLeads, publishOrderUpdate } from "../../lib/realtime.js";
import { DEFAULT_TRANSFER_PREFIX } from "../../lib/transfer-prefix.js";
import { verifyTurnstileToken } from "../../lib/turnstile.js";
import { buildVietQrUrl } from "../../lib/vietqr.js";
import { rateLimitByKey } from "../../middleware/rate-limit.js";
import type { AppEnv } from "../../types.js";

export const publicRoutes = new Hono<AppEnv>();

/** database-schema.md note #3: retry a fresh code on a `uq_order_code` collision. */
const ORDER_CODE_ATTEMPTS = 5;
const UNIQUE_VIOLATION = "23505";
// ponytail: no privacy-policy versioning system exists yet — one hardcoded version, bump this
// string (and start passing a real version through) once the dashboard has a policy editor.
const CONSENT_POLICY_VERSION = "2026-01-01";

publicRoutes.post("/leads", async (c) => {
  const db = createDbFromEnv(c.env);
  const body = publicLeadSubmitSchema.parse(await c.req.json());
  const ip = clientIp(c);

  // FR-D-03 honeypot: bots fill every field, including this hidden one — fake success, no work done.
  if (body.honeypot.length > 0) {
    return c.json(
      publicLeadResultSchema.parse({
        leadId: "0".repeat(26),
        status: "created",
        order: null
      }),
      201
    );
  }

  const turnstileOk = await verifyTurnstileToken(
    c.env.TURNSTILE_SECRET_KEY,
    body.turnstileToken,
    ip
  );
  if (!turnstileOk) throw new ApiError(403, "turnstile_failed");

  const phone = normalizeVnPhone(body.phone);
  if (!phone) throw new ApiError(400, "invalid_phone");

  const campaign = await campaignsRepository.findById(
    db,
    body.orgId,
    body.campaignId
  );
  if (!campaign || campaign.deletedAt) {
    throw new ApiError(404, "campaign_not_found");
  }

  // FR-E-06: a repeat submit merges into the existing lead + logs a resubmit activity,
  // it never creates a second lead for the same phone in this org.
  const { lead, merged } = await findOrCreateLead(db, body, campaign, phone);
  const status = merged ? "merged" : "created";
  // in-app realtime bell (module E finding #4) — only a genuinely new lead is worth surfacing,
  // a resubmit merge into an existing lead already has its own activity-log trail.
  if (!merged) await publishNewLeads(c.env, body.orgId, 1);

  await leadActivitiesRepository.insert(db, body.orgId, {
    leadId: lead.id,
    type: merged ? "resubmit" : "system",
    body: merged
      ? `Đăng ký lại campaign ${campaign.name}`
      : `Đăng ký qua form campaign ${campaign.name}`,
    meta: { campaignId: campaign.id },
    actorId: null
  });

  // NFR-09 / Nghị định 13/2023/NĐ-CP: a consent row is written on every submit, never inferred.
  await consentsRepository.insert(db, body.orgId, {
    leadId: lead.id,
    consentType: "data_collection",
    policyVersion: CONSENT_POLICY_VERSION,
    ip: ip ?? null
  });

  const order = await maybeCreateOrder(db, body.orgId, campaign, lead.id);

  return c.json(
    publicLeadResultSchema.parse({ leadId: lead.id, status, order }),
    201
  );
});

/** FR-D-06 "Tôi đã chuyển khoản": customer-declared transfer, only valid from `pending` — the
 * webhook auto-match (FR-D-05) already moves straight to `paid` and shouldn't be reverted here. */
publicRoutes.post("/orders/:code/confirm-transfer", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = c.req.query("orgId");
  if (!orgId) throw new ApiError(400, "missing_org_id");
  const code = c.req.param("code");

  const order = await ordersRepository.findByCode(db, orgId, code);
  if (!order) throw new ApiError(404, "order_not_found");
  if (order.status !== "pending") {
    throw new ApiError(400, "invalid_order_transition");
  }

  const updated = await ordersRepository.update(db, orgId, order.id, {
    status: "awaiting_confirmation"
  });
  if (updated) await publishOrderUpdate(c.env, orgId, updated);
  await leadActivitiesRepository.insert(db, orgId, {
    leadId: order.leadId,
    type: "system",
    body: "Khách báo đã chuyển khoản",
    meta: { orderId: order.id, from: "pending", to: "awaiting_confirmation" },
    actorId: null
  });

  const campaign = await campaignsRepository.findById(
    db,
    orgId,
    order.campaignId
  );
  const paymentConfig = campaignPaymentConfigSchema.parse(
    campaign?.paymentConfig
  );

  return c.json(
    confirmOrderTransferResultSchema.parse({
      status: updated?.status ?? "awaiting_confirmation",
      zaloLink: paymentConfig.zaloGroupUrl ?? null
    })
  );
});

/** FR-D-07: landing page polls this for up to 10 minutes, then falls back to manual
 * instructions client-side. NFR-16: rate-limited by IP + campaign (not just IP, since
 * many buyers on the same viral landing/campaign can share an IP behind NAT) on top of
 * the edge's 2s cache (architecture.md §5.3) — keeps one viral landing from drowning
 * out polling for the rest of the campaign's orders. */
publicRoutes.get("/orders/:code/status", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = c.req.query("orgId");
  if (!orgId) throw new ApiError(400, "missing_org_id");
  const code = c.req.param("code");

  const order = await ordersRepository.findByCode(db, orgId, code);
  if (!order) throw new ApiError(404, "order_not_found");

  await rateLimitByKey(
    c,
    `order-status:${order.campaignId}:${clientIp(c) ?? "unknown"}`,
    { windowSeconds: 60, max: 40 }
  );

  return c.json(
    publicOrderStatusSchema.parse({
      status: order.status,
      expiresAt: order.expiresAt
    })
  );
});

/** Fields `findOrCreateLead` actually reads — lets callers that don't go through the public
 * submit form (e.g. the CSV import route) reuse it without fabricating consent/turnstile data. */
export type LeadUpsertInput = Pick<
  PublicLeadSubmitInput,
  "orgId" | "fullName" | "email" | "persona" | "customFields" | "utm"
>;

/**
 * FR-E-06: find-then-insert has a real race (two concurrent submits for the same never-before-seen
 * phone can both miss `findByPhone` and both attempt `insert`) — `uq_lead_phone` catches the loser
 * as a 23505, which this retries as a merge into the winner instead of letting it 500.
 *
 * Exported so the CRM leads CSV import route (module E) can dedupe-by-phone the same way an
 * organic form submission does, instead of re-implementing the race-safe upsert.
 */
export async function findOrCreateLead(
  db: ReturnType<typeof createDbFromEnv>,
  body: LeadUpsertInput,
  campaign: NonNullable<
    Awaited<ReturnType<typeof campaignsRepository.findById>>
  >,
  phone: string
) {
  const existingLead = await leadsRepository.findByPhone(db, body.orgId, phone);
  if (existingLead) {
    const updated = await leadsRepository.update(
      db,
      body.orgId,
      existingLead.id,
      {
        fullName: body.fullName,
        email: body.email ?? null,
        persona: body.persona ?? null,
        customFields: body.customFields,
        utm: body.utm
      }
    );
    return { lead: updated ?? existingLead, merged: true };
  }

  try {
    const assigneeId = await pickRoundRobinAssignee(db, body.orgId, campaign);
    const inserted = await leadsRepository.insert(db, body.orgId, {
      campaignId: campaign.id,
      fullName: body.fullName,
      phone,
      email: body.email ?? null,
      persona: body.persona ?? null,
      customFields: body.customFields,
      utm: body.utm,
      stage: "new",
      assigneeId
    });
    if (!inserted) throw new ApiError(500, "lead_insert_failed");
    return { lead: inserted, merged: false };
  } catch (err) {
    if ((err as { code?: string }).code !== UNIQUE_VIOLATION) throw err;
    // lost the race — someone else just created the lead this same phone would have used.
    const winner = await leadsRepository.findByPhone(db, body.orgId, phone);
    if (!winner) throw err;
    const updated = await leadsRepository.update(db, body.orgId, winner.id, {
      fullName: body.fullName,
      email: body.email ?? null,
      persona: body.persona ?? null,
      customFields: body.customFields,
      utm: body.utm
    });
    return { lead: updated ?? winner, merged: true };
  }
}

/**
 * FR-E-04 round-robin: rotates new leads across the org's `sales` members in a fixed order
 * (by membership creation order), advancing `campaigns.roundRobinCursor` each time. Falls back
 * to unassigned (`null`) for `manual` campaigns or orgs with no sales members yet.
 */
async function pickRoundRobinAssignee(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  campaign: NonNullable<
    Awaited<ReturnType<typeof campaignsRepository.findById>>
  >
): Promise<string | null> {
  if (campaign.assignmentMode !== "round_robin") return null;

  const salesMembers = await membershipsRepository.listByRole(
    db,
    orgId,
    "sales"
  );
  if (salesMembers.length === 0) return null;

  const currentIndex = salesMembers.findIndex(
    (member) => member.userId === campaign.roundRobinCursor
  );
  const next = salesMembers[(currentIndex + 1) % salesMembers.length]!;

  await campaignsRepository.update(db, orgId, campaign.id, {
    roundRobinCursor: next.userId
  });
  return next.userId;
}

/** FR-D-04: an order is only created when the campaign has payment enabled and a resolvable amount. */
async function maybeCreateOrder(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  campaign: NonNullable<
    Awaited<ReturnType<typeof campaignsRepository.findById>>
  >,
  leadId: string
) {
  const paymentConfig = campaignPaymentConfigSchema.parse(
    campaign.paymentConfig
  );
  if (
    !paymentConfig.enabled ||
    !paymentConfig.bankBin ||
    !paymentConfig.accountNumber
  ) {
    return null;
  }

  let amount: number | null = null;
  let productId: string | null = null;
  if (paymentConfig.amountSource === "fixed") {
    amount = paymentConfig.fixedAmount ?? null;
  } else {
    const linkedProducts = await productsRepository.listForCampaign(
      db,
      orgId,
      campaign.id
    );
    const paid = linkedProducts.find(
      (product) => product.isActive && Number(product.price) > 0
    );
    if (paid) {
      amount = Number(paid.price);
      productId = paid.id;
    }
  }
  if (amount === null || amount <= 0) return null;

  const expiresAt = paymentConfig.expireMinutes
    ? new Date(Date.now() + paymentConfig.expireMinutes * 60_000)
    : null;
  const prefix = paymentConfig.transferPrefix ?? DEFAULT_TRANSFER_PREFIX;

  let created: Awaited<ReturnType<typeof ordersRepository.insert>>;
  for (let attempt = 0; attempt < ORDER_CODE_ATTEMPTS; attempt++) {
    const code =
      prefix + payments.encodeOrderCode(payments.generateOrderCodeData());
    try {
      // each attempt depends on the previous one's conflict result, can't run in parallel
      // oxlint-disable-next-line no-await-in-loop
      created = await ordersRepository.insert(db, orgId, {
        code,
        leadId,
        campaignId: campaign.id,
        productId,
        amount: String(amount),
        status: "pending",
        expiresAt
      });
      break;
    } catch (err) {
      if ((err as { code?: string }).code !== UNIQUE_VIOLATION) throw err;
    }
  }
  if (!created) throw new ApiError(500, "order_code_generation_failed");

  await leadActivitiesRepository.insert(db, orgId, {
    leadId,
    type: "order_created",
    body: `Tạo đơn ${created.code}`,
    meta: { orderId: created.id },
    actorId: null
  });

  return {
    orderCode: created.code,
    qrUrl: buildVietQrUrl({
      bankBin: paymentConfig.bankBin,
      accountNumber: paymentConfig.accountNumber,
      amount,
      addInfo: created.code,
      accountName: paymentConfig.accountName
    }),
    amount,
    zaloLink: paymentConfig.zaloGroupUrl ?? null
  };
}
