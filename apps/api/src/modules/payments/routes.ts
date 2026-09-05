import { encryptApiKey, importMasterKey } from "@dv/ai-gateway";
import { can } from "@dv/auth";
import {
  connectPaymentConnectionSchema,
  createRefundRequestSchema,
  executeFulfillmentSchema,
  fulfillmentTaskResponseSchema,
  orderSearchResponseSchema,
  paymentConnectionGuideSchema,
  publicPaymentConnectionSchema,
  refundRequestListSchema,
  refundRequestSchema,
  refundRequestWithOrderListSchema,
  refundRequestWithOrderSchema,
  refundStatusSchema,
  resolveUnmatchedTransactionSchema,
  unmatchedTransactionSchema,
  unmatchedTransactionWithCandidatesSchema,
  updateRefundRequestSchema
} from "@dv/contracts";
import {
  auditLogsRepository,
  fulfillmentTasksRepository,
  leadActivitiesRepository,
  ordersRepository,
  paymentConnectionsRepository,
  paymentsRepository,
  productsRepository,
  refundRequestsRepository,
  unmatchedTransactionsRepository
} from "@dv/db";
import type { Db } from "@dv/db";
import { payments } from "@dv/drivers";
import { Hono, type Context } from "hono";
import { z } from "zod";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { publishOrderUpdate } from "@/lib/realtime.js";
import { createStorageFromEnv } from "@/lib/storage.js";
import type { AppEnv } from "@/types.js";

export const paymentsRoutes = new Hono<AppEnv>();

const UNIQUE_VIOLATION = "23505";

/** `Variables.orgId` is nullable app-wide but `requireOrgSession` guarantees it here (app.ts). */
function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

/** FR-D-11: refund actions gate on the "Xác nhận thanh toán" permission (architecture.md §6) —
 * owner/admin/sales, not manager. */
function requireRefundPermission(c: Context<AppEnv>): void {
  if (!can(c.get("membershipRole"), "confirmPayment")) {
    throw new ApiError(403, "forbidden");
  }
}

/** SePay is the only driver wired up so far (FR-D-10) — its `rawPayload.transferAmount` is
 * where the transaction amount lives (see `packages/drivers/src/payments/sepay.ts`). Extend
 * with a per-provider switch when a second driver ships. */
function extractPaymentAmount(rawPayload: unknown): number | null {
  if (typeof rawPayload !== "object" || rawPayload === null) return null;
  const value = (rawPayload as Record<string, unknown>).transferAmount;
  return typeof value === "number" ? value : null;
}

/** FR-D-11: SePay's transfer-content webhook payload doesn't carry the sender's name/account
 * (only `content`/`accountNumber` for the *receiving* account) — this stays `{}` in practice and
 * the FR-D-12 checklist screen falls back to manual entry, exactly as the FR doc anticipates. */
function extractRemitterInfo(rawPayload: unknown): Record<string, unknown> {
  if (typeof rawPayload !== "object" || rawPayload === null) return {};
  const payload = rawPayload as Record<string, unknown>;
  const remitterInfo: Record<string, unknown> = {};
  if (typeof payload.remitterName === "string") {
    remitterInfo.name = payload.remitterName;
  }
  if (typeof payload.remitterAccountNumber === "string") {
    remitterInfo.accountNumber = payload.remitterAccountNumber;
  }
  return remitterInfo;
}

/** `importMasterKey` is cheap (one `crypto.subtle.importKey` call) — no need to cache across requests. */
function importPaymentsMasterKey(env: AppEnv["Bindings"]): Promise<CryptoKey> {
  return importMasterKey(env.PAYMENTS_KEY_MASTER_SECRET);
}

// SePay is the only driver wired up so far (FR-D-10) — `getConnectionGuide` doesn't
// read `transferPrefix` (that's campaign-level, only used by `matchTransaction`), so an
// empty placeholder here is fine.
const sepayDriver = payments.createSepayPaymentsDriver({ transferPrefix: "" });

async function ensureFulfillmentTask(db: Db, orgId: string, orderId: string) {
  const order = await ordersRepository.findById(db, orgId, orderId);
  if (!order) throw new ApiError(404, "order_not_found");
  if (order.status !== "paid" && order.status !== "fulfilled") {
    throw new ApiError(400, "order_not_ready_for_fulfillment");
  }

  const existing = await fulfillmentTasksRepository.findForOrder(
    db,
    orgId,
    orderId
  );
  if (existing) return { order, task: existing };

  const snapshot =
    order.fulfillmentConfig &&
    typeof order.fulfillmentConfig === "object" &&
    !Array.isArray(order.fulfillmentConfig)
      ? (order.fulfillmentConfig as Record<string, unknown>)
      : {};
  const product =
    Object.keys(snapshot).length === 0 && order.productId
      ? await productsRepository.findById(db, orgId, order.productId)
      : undefined;
  const attributes =
    Object.keys(snapshot).length > 0
      ? snapshot
      : product?.attributes &&
          typeof product.attributes === "object" &&
          !Array.isArray(product.attributes)
        ? (product.attributes as Record<string, unknown>)
        : {};
  const type = z
    .enum(["link", "zalo", "schedule", "manual"])
    .catch("manual")
    .parse(attributes.fulfillmentType ?? attributes.deliveryType);
  const config = {
    ...(typeof attributes.resourceUrl === "string"
      ? { resourceUrl: attributes.resourceUrl }
      : {}),
    ...(typeof attributes.zaloGroupUrl === "string"
      ? { zaloGroupUrl: attributes.zaloGroupUrl }
      : {}),
    ...(typeof attributes.instructions === "string"
      ? { instructions: attributes.instructions }
      : typeof attributes.activationInstructions === "string"
        ? { instructions: attributes.activationInstructions }
        : {}),
    ...(typeof attributes.scheduledAt === "string"
      ? { scheduledAt: attributes.scheduledAt }
      : typeof attributes.startsAt === "string"
        ? { scheduledAt: attributes.startsAt }
        : {})
  };
  const task = await fulfillmentTasksRepository.ensureForOrder(db, orgId, {
    orderId,
    type,
    status: order.status === "fulfilled" ? "completed" : "pending",
    config,
    attempts: 0,
    lastError: null,
    completedAt: order.status === "fulfilled" ? order.fulfilledAt : null
  });
  if (!task) throw new ApiError(500, "fulfillment_task_create_failed");
  return { order, task };
}
/** Fulfillment is an explicit seller confirmation. A paid order never becomes fulfilled merely because a task exists. */
paymentsRoutes.get("/orders/:orderId/fulfillment", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const { task } = await ensureFulfillmentTask(
    db,
    orgId,
    c.req.param("orderId")
  );
  return c.json(fulfillmentTaskResponseSchema.parse({ task }));
});

paymentsRoutes.post("/orders/:orderId/fulfillment/execute", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const userId = c.get("userId");
  requireRefundPermission(c);
  const orderId = c.req.param("orderId");
  const body = executeFulfillmentSchema.parse(await c.req.json());
  const { order, task } = await ensureFulfillmentTask(db, orgId, orderId);

  if (task.status === "completed") {
    return c.json(fulfillmentTaskResponseSchema.parse({ task }));
  }
  const claimed = await fulfillmentTasksRepository.claimForExecution(
    db,
    orgId,
    task.id,
    task.attempts + 1
  );
  if (!claimed) throw new ApiError(409, "fulfillment_in_progress");

  try {
    const completed = await fulfillmentTasksRepository.markCompleted(
      db,
      orgId,
      claimed.id
    );
    if (!completed) throw new ApiError(500, "fulfillment_task_update_failed");

    const updatedOrder =
      order.status === "paid"
        ? await ordersRepository.update(db, orgId, order.id, {
            status: "fulfilled",
            fulfilledAt: new Date()
          })
        : order;
    if (updatedOrder) await publishOrderUpdate(c.env, orgId, updatedOrder);

    await leadActivitiesRepository.insert(db, orgId, {
      leadId: order.leadId,
      type: "system",
      body: null,
      meta: {
        orderId: order.id,
        fulfillmentTaskId: claimed.id,
        confirmationNote: body.confirmationNote ?? null
      },
      actorId: userId
    });
    await auditLogsRepository.insert(db, orgId, {
      actorId: userId,
      action: "fulfillment.complete",
      targetType: "fulfillment_task",
      targetId: claimed.id,
      meta: { orderId: order.id, type: claimed.type }
    });

    return c.json(fulfillmentTaskResponseSchema.parse({ task: completed }));
  } catch (error) {
    await fulfillmentTasksRepository.markFailed(
      db,
      orgId,
      claimed.id,
      error instanceof Error ? error.message : "fulfillment_failed"
    );
    await auditLogsRepository.insert(db, orgId, {
      actorId: userId,
      action: "fulfillment.failed",
      targetType: "fulfillment_task",
      targetId: claimed.id,
      meta: { orderId: order.id }
    });
    throw error;
  }
});

paymentsRoutes.get("/connections", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const rows = await paymentConnectionsRepository.list(db, orgId);
  return c.json({
    connections: z.array(publicPaymentConnectionSchema).parse(rows)
  });
});

/** Static step-by-step "connect this provider" content (FR-D-15) — no auth-scoped data, just gated behind `requireOrgSession` like the rest of this module. */
paymentsRoutes.get("/connections/guide", (c) => {
  return c.json(
    paymentConnectionGuideSchema.parse(sepayDriver.getConnectionGuide())
  );
});

paymentsRoutes.post("/connections", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = connectPaymentConnectionSchema.parse(await c.req.json());

  const existing = await paymentConnectionsRepository.list(db, orgId);
  if (existing.some((row) => row.provider === "sepay")) {
    throw new ApiError(409, "payment_connection_exists");
  }

  const masterKey = await importPaymentsMasterKey(c.env);
  const encryptedApiKey = await encryptApiKey(body.apiKey, masterKey);

  const row = await paymentConnectionsRepository.insert(db, orgId, {
    provider: "sepay",
    encryptedApiKey,
    bankBin: body.bankBin,
    accountNumber: body.accountNumber,
    accountName: body.accountName,
    status: "active"
  });

  return c.json(publicPaymentConnectionSchema.parse(row), 201);
});

paymentsRoutes.delete("/connections/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const removed = await paymentConnectionsRepository.remove(
    db,
    orgId,
    c.req.param("id")
  );
  if (!removed) throw new ApiError(404, "payment_connection_not_found");
  return c.body(null, 204);
});

/** FR-D-09 reconciliation screen: pending `unmatchedTransactions`, `ambiguous` ones carrying
 * their candidate orders (ranked as written by `matchAcrossPrefixes`, webhooks/routes.ts). */
paymentsRoutes.get("/unmatched", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);

  const rows = (await unmatchedTransactionsRepository.list(db, orgId)).filter(
    (row) => row.status === "pending"
  );

  const candidateIds = [
    ...new Set(rows.flatMap((row) => row.candidateOrderIds as string[]))
  ];
  const candidates = await ordersRepository.findCandidatesByIds(
    db,
    orgId,
    candidateIds
  );
  const candidateById = new Map(
    candidates.map((candidate) => [candidate.orderId, candidate])
  );

  const result = rows.map((row) => ({
    ...row,
    amount: extractPaymentAmount(row.rawPayload),
    candidates: (row.candidateOrderIds as string[])
      .map((id) => candidateById.get(id))
      .filter((candidate) => candidate !== undefined)
  }));

  return c.json({
    transactions: z
      .array(unmatchedTransactionWithCandidatesSchema)
      .parse(result)
  });
});

/** FR-D-09 manual match: sales picks one order (from the ranked candidates when `ambiguous`,
 * or any order when `no_candidate`/`already_paid`), writes `payments.matchType=manual` and an
 * audit log entry, and settles the order — mirrors `recordMatch` in webhooks/routes.ts. */
paymentsRoutes.post("/unmatched/:id/resolve", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const userId = c.get("userId");
  const id = c.req.param("id");
  const body = resolveUnmatchedTransactionSchema.parse(await c.req.json());

  const unmatched = await unmatchedTransactionsRepository.findById(
    db,
    orgId,
    id
  );
  if (!unmatched) throw new ApiError(404, "unmatched_transaction_not_found");
  if (unmatched.status === "resolved") {
    throw new ApiError(409, "unmatched_transaction_already_resolved");
  }

  if (body.dismissed) {
    const dismissed = await unmatchedTransactionsRepository.update(
      db,
      orgId,
      id,
      { status: "resolved", resolvedBy: userId, resolvedAt: new Date() }
    );
    await auditLogsRepository.insert(db, orgId, {
      actorId: userId,
      action: "unmatched_transaction.dismiss",
      targetType: "unmatched_transaction",
      targetId: id,
      meta: { reason: unmatched.reason }
    });
    return c.json(unmatchedTransactionSchema.parse(dismissed));
  }

  // `resolveUnmatchedTransactionSchema` guarantees `orderId` is set when `dismissed` isn't.
  const orderId = body.orderId as string;
  if (
    unmatched.reason === "ambiguous" &&
    !(unmatched.candidateOrderIds as string[]).includes(orderId)
  ) {
    throw new ApiError(400, "order_not_a_candidate");
  }

  const order = await ordersRepository.findById(db, orgId, orderId);
  if (!order) throw new ApiError(404, "order_not_found");

  const amount =
    extractPaymentAmount(unmatched.rawPayload) ?? Number(order.amount);

  try {
    await paymentsRepository.insert(db, orgId, {
      orderId: order.id,
      provider: "sepay",
      providerTxId: unmatched.providerTxId,
      amount: String(amount),
      rawPayload: unmatched.rawPayload,
      matchType: "manual"
    });
  } catch (err) {
    if ((err as { code?: string }).code === UNIQUE_VIOLATION) {
      throw new ApiError(409, "payment_already_recorded");
    }
    throw err;
  }

  const updatedOrder = await ordersRepository.update(db, orgId, order.id, {
    status: "paid",
    paidAt: new Date()
  });
  if (updatedOrder) await publishOrderUpdate(c.env, orgId, updatedOrder);

  const resolved = await unmatchedTransactionsRepository.update(db, orgId, id, {
    status: "resolved",
    resolvedOrderId: order.id,
    resolvedBy: userId,
    resolvedAt: new Date()
  });

  await auditLogsRepository.insert(db, orgId, {
    actorId: userId,
    action: "unmatched_transaction.manual_match",
    targetType: "unmatched_transaction",
    targetId: id,
    meta: { orderId: order.id, reason: unmatched.reason }
  });

  return c.json(unmatchedTransactionSchema.parse(resolved));
});

/** FR-D-09 manual order-attach picker for `no_candidate` unmatched transactions — sales
 * searches by order code or lead phone instead of picking from a ranked candidate list. */
paymentsRoutes.get("/orders/search", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const q = c.req.query("q")?.trim();
  if (!q) return c.json(orderSearchResponseSchema.parse({ orders: [] }));

  const rows = await ordersRepository.search(db, orgId, q);
  return c.json(orderSearchResponseSchema.parse({ orders: rows }));
});

/** Org-wide refund-requests list (FR-D-12), filterable by status. */
paymentsRoutes.get("/refund-requests", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const status = refundStatusSchema.optional().parse(c.req.query("status"));
  const rows = await refundRequestsRepository.listWithOrder(db, orgId, status);
  return c.json(
    refundRequestWithOrderListSchema.parse({ refundRequests: rows })
  );
});

/** Refund-request detail screen (FR-D-12/13). */
paymentsRoutes.get("/refund-requests/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const row = await refundRequestsRepository.findByIdWithOrder(
    db,
    orgId,
    c.req.param("id")
  );
  if (!row) throw new ApiError(404, "refund_request_not_found");
  return c.json(refundRequestWithOrderSchema.parse(row));
});

/** FR-D-12 checklist screen data + CRM duplicate-payment badge (FR-D-14). */
paymentsRoutes.get("/orders/:orderId/refund-requests", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const rows = await refundRequestsRepository.listForOrder(
    db,
    orgId,
    c.req.param("orderId")
  );
  return c.json(refundRequestListSchema.parse({ refundRequests: rows }));
});

/** FR-D-11: order detail "Yêu cầu hoàn tiền" action. Non-custodial — the platform never holds
 * funds, so this only opens the tracking record; the tenant transfers the refund themselves
 * (FR-D-12/13). `amount`/`remitterInfo` are derived, not client-supplied. */
paymentsRoutes.post("/orders/:orderId/refund-requests", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireRefundPermission(c);
  const orderId = c.req.param("orderId");
  const body = createRefundRequestSchema.parse(await c.req.json());

  const order = await ordersRepository.findById(db, orgId, orderId);
  if (!order) throw new ApiError(404, "order_not_found");
  if (order.status !== "paid" && order.status !== "fulfilled") {
    throw new ApiError(400, "order_not_refundable");
  }

  const payment = await paymentsRepository.findLatestForOrder(
    db,
    orgId,
    orderId
  );

  const created = await refundRequestsRepository.insert(db, orgId, {
    orderId,
    paymentId: payment?.id ?? null,
    reason: body.reason,
    amount: order.amount,
    remitterInfo: extractRemitterInfo(payment?.rawPayload),
    status: "pending",
    createdBy: c.get("userId")
  });

  return c.json(refundRequestSchema.parse(created), 201);
});

/** FR-D-12: fills in remitter info the checklist needs to make the manual transfer, for when
 * SePay's webhook payload didn't carry it. */
paymentsRoutes.patch("/refund-requests/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireRefundPermission(c);
  const id = c.req.param("id");
  const body = updateRefundRequestSchema.parse(await c.req.json());

  const existing = await refundRequestsRepository.findById(db, orgId, id);
  if (!existing) throw new ApiError(404, "refund_request_not_found");
  if (existing.status === "completed" || existing.status === "rejected") {
    throw new ApiError(409, "refund_request_already_settled");
  }

  const updated = await refundRequestsRepository.update(db, orgId, id, {
    remitterInfo: body.remitterInfo
  });
  return c.json(refundRequestSchema.parse(updated));
});

const MAX_EVIDENCE_BYTES = 20 * 1024 * 1024;

/** FR-D-13 checklist: optional receipt photo proving the manual transfer went through — same
 * R2-backed upload shape as `POST /:id/assets` in landings/routes.ts. */
paymentsRoutes.post("/refund-requests/:id/evidence", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireRefundPermission(c);
  const id = c.req.param("id");

  const existing = await refundRequestsRepository.findById(db, orgId, id);
  if (!existing) throw new ApiError(404, "refund_request_not_found");

  const form = await c.req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw new ApiError(400, "file_required");
  if (file.size > MAX_EVIDENCE_BYTES) throw new ApiError(413, "file_too_large");

  const storage = createStorageFromEnv(c.env);
  const r2Key = `refund-requests/${id}/${crypto.randomUUID()}-${file.name}`;
  await storage.put({
    key: r2Key,
    body: await file.arrayBuffer(),
    contentType: file.type || "application/octet-stream"
  });

  const updated = await refundRequestsRepository.update(db, orgId, id, {
    evidenceKey: r2Key
  });
  return c.json(refundRequestSchema.parse(updated));
});

/** Streams the uploaded receipt photo back for the detail screen (same authenticated-stream
 * pattern as `GET /:id/assets/:assetId/file` in landings/routes.ts). */
paymentsRoutes.get("/refund-requests/:id/evidence", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const existing = await refundRequestsRepository.findById(
    db,
    orgId,
    c.req.param("id")
  );
  if (!existing?.evidenceKey) throw new ApiError(404, "evidence_not_found");

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(existing.evidenceKey);
  if (!object) throw new ApiError(404, "evidence_not_found");

  return new Response(object.body, {
    headers: {
      "content-type": object.contentType ?? "application/octet-stream"
    }
  });
});

/** FR-D-13: tenant marks the manual bank transfer done → order settles to `refunded`. */
paymentsRoutes.post("/refund-requests/:id/complete", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireRefundPermission(c);
  const userId = c.get("userId");
  const id = c.req.param("id");

  const existing = await refundRequestsRepository.findById(db, orgId, id);
  if (!existing) throw new ApiError(404, "refund_request_not_found");
  if (existing.status === "completed" || existing.status === "rejected") {
    throw new ApiError(409, "refund_request_already_settled");
  }
  const order = await ordersRepository.findById(db, orgId, existing.orderId);
  if (!order) throw new ApiError(404, "order_not_found");

  const [completed, updatedOrder] = await Promise.all([
    refundRequestsRepository.update(db, orgId, id, {
      status: "completed",
      completedAt: new Date()
    }),
    ordersRepository.update(db, orgId, order.id, { status: "refunded" })
  ]);
  if (updatedOrder) await publishOrderUpdate(c.env, orgId, updatedOrder);

  await leadActivitiesRepository.insert(db, orgId, {
    leadId: order.leadId,
    type: "system",
    body: null,
    meta: { orderId: order.id, refundRequestId: id },
    actorId: userId
  });

  await auditLogsRepository.insert(db, orgId, {
    actorId: userId,
    action: "refund_request.complete",
    targetType: "refund_request",
    targetId: id,
    meta: { orderId: existing.orderId }
  });

  return c.json(refundRequestSchema.parse(completed));
});

/** Tenant declines the refund (e.g. investigation showed nothing is owed) — no money moved, so
 * unlike /complete the order keeps its current status; this only closes the tracking record. */
paymentsRoutes.post("/refund-requests/:id/reject", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireRefundPermission(c);
  const userId = c.get("userId");
  const id = c.req.param("id");

  const existing = await refundRequestsRepository.findById(db, orgId, id);
  if (!existing) throw new ApiError(404, "refund_request_not_found");
  if (existing.status === "completed" || existing.status === "rejected") {
    throw new ApiError(409, "refund_request_already_settled");
  }
  const order = await ordersRepository.findById(db, orgId, existing.orderId);
  if (!order) throw new ApiError(404, "order_not_found");

  const rejected = await refundRequestsRepository.update(db, orgId, id, {
    status: "rejected"
  });

  await leadActivitiesRepository.insert(db, orgId, {
    leadId: order.leadId,
    type: "system",
    body: null,
    meta: { orderId: order.id, refundRequestId: id },
    actorId: userId
  });

  await auditLogsRepository.insert(db, orgId, {
    actorId: userId,
    action: "refund_request.reject",
    targetType: "refund_request",
    targetId: id,
    meta: { orderId: existing.orderId }
  });

  return c.json(refundRequestSchema.parse(rejected));
});
