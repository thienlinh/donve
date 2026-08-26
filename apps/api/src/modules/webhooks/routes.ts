import { decryptApiKey, importMasterKey } from "@dv/ai-gateway";
import { campaignPaymentConfigSchema } from "@dv/contracts";
import {
  campaignsRepository,
  ordersRepository,
  paymentConnectionsRepository,
  paymentsRepository,
  refundRequestsRepository,
  unmatchedTransactionsRepository
} from "@dv/db";
import { payments } from "@dv/drivers";
import { Hono } from "hono";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { publishOrderUpdate } from "@/lib/realtime.js";
import { timingSafeEqual } from "@/lib/timing-safe-equal.js";
import { DEFAULT_TRANSFER_PREFIX } from "@/lib/transfer-prefix.js";
import type { AppEnv } from "@/types.js";

export const webhooksRoutes = new Hono<AppEnv>();

const UNIQUE_VIOLATION = "23505";

// `transferPrefix` only matters for `matchTransaction`, called directly (not via this driver
// instance) so each org's campaign prefixes can be tried — see `matchAcrossPrefixes` below.
const sepayDriver = payments.createSepayPaymentsDriver({ transferPrefix: "" });

interface ResolvedConnection {
  orgId: string;
  apiKey: string;
  bankBin: string;
  accountNumber: string;
}

/**
 * FR-D-05 / architecture.md §7 "Webhook giả mạo SePay": there's no org context yet at this
 * point, so every active `sepay` connection (across all orgs) is decrypted and compared
 * against the presented secret via `withPlatformScope` (see paymentConnectionsRepository).
 * ponytail: O(active sepay connections) decrypt-and-compare per webhook call — `encryptedApiKey`
 * is AES-GCM with a random IV, so there's no indexable hash to look up directly. Add a keyed-HMAC
 * lookup column if this ever shows up in latency/cost.
 */
async function resolveConnection(
  db: ReturnType<typeof createDbFromEnv>,
  env: AppEnv["Bindings"],
  authorization: string
): Promise<ResolvedConnection | null> {
  const headerPrefix = "Apikey ";
  if (!authorization.startsWith(headerPrefix)) return null;
  const presented = authorization.slice(headerPrefix.length);

  const [masterKey, candidates] = await Promise.all([
    importMasterKey(env.PAYMENTS_KEY_MASTER_SECRET),
    paymentConnectionsRepository.listActiveByProvider(db, "sepay")
  ]);

  for (const row of candidates) {
    let apiKey: string;
    try {
      // oxlint-disable-next-line no-await-in-loop -- must try each candidate in turn, no way to batch a decrypt
      apiKey = await decryptApiKey(row.encryptedApiKey, masterKey);
    } catch {
      continue;
    }
    if (timingSafeEqual(apiKey, presented)) {
      return {
        orgId: row.orgId,
        apiKey,
        bankBin: row.bankBin,
        accountNumber: row.accountNumber
      };
    }
  }
  return null;
}

/** Every campaign's configured (or default) transfer prefix, deduped — FR-D-05's matching prefix is per-campaign, not per-org. */
async function resolveTransferPrefixes(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string
): Promise<string[]> {
  const campaigns = await campaignsRepository.list(db, orgId);
  const prefixes = new Set<string>();
  for (const campaign of campaigns) {
    if (campaign.deletedAt) continue;
    const config = campaignPaymentConfigSchema.parse(campaign.paymentConfig);
    prefixes.add(config.transferPrefix ?? DEFAULT_TRANSFER_PREFIX);
  }
  if (prefixes.size === 0) prefixes.add(DEFAULT_TRANSFER_PREFIX);
  return [...prefixes];
}

async function findOrderCandidates(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  code: string
): Promise<payments.OrderMatchCandidate[]> {
  const order = await ordersRepository.findByCode(db, orgId, code);
  if (!order) return [];
  return [
    {
      id: order.id,
      code: order.code,
      amount: Number(order.amount),
      status: order.status,
      expiresAt: order.expiresAt
    }
  ];
}

/**
 * Runs the FR-D-05 2-step matcher once per candidate prefix. A prefix the transfer content
 * doesn't actually contain trivially yields `no_candidate` (no windows start with it), so in
 * practice only the true prefix ever returns something else — the first `matched` wins, and
 * the most specific non-`no_candidate` unmatched reason is kept as fallback.
 */
async function matchAcrossPrefixes(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  event: payments.VerifiedPaymentEvent,
  prefixes: string[]
): Promise<payments.MatchTransactionResult> {
  let fallback: payments.MatchTransactionResult = {
    outcome: "unmatched",
    reason: "no_candidate",
    candidateOrderIds: []
  };

  for (const prefix of prefixes) {
    // sequential by design — a match on an earlier prefix must short-circuit the rest
    // oxlint-disable-next-line no-await-in-loop
    const result = await payments.matchContentBasedTransaction({
      event,
      prefix,
      findOrderCandidates: (code) =>
        findOrderCandidates(db, orgId, prefix + code)
    });
    if (result.outcome === "matched") return result;
    if (result.reason !== "no_candidate") fallback = result;
  }
  return fallback;
}

async function recordMatch(
  db: ReturnType<typeof createDbFromEnv>,
  env: AppEnv["Bindings"],
  orgId: string,
  event: payments.VerifiedPaymentEvent,
  result: Extract<payments.MatchTransactionResult, { outcome: "matched" }>
): Promise<void> {
  try {
    await paymentsRepository.insert(db, orgId, {
      orderId: result.orderId,
      provider: "sepay",
      providerTxId: event.providerTxId,
      amount: String(event.amount),
      rawPayload: event.rawPayload,
      matchType: result.matchType
    });
  } catch (err) {
    // uq_payment_tx: a retried webhook delivery for a transaction already recorded — idempotent no-op.
    if ((err as { code?: string }).code === UNIQUE_VIOLATION) return;
    throw err;
  }
  const updated = await ordersRepository.update(db, orgId, result.orderId, {
    status: "paid",
    paidAt: new Date()
  });
  // architecture.md §5.3: pushes the paid transition to the dashboard SSE hub instead of
  // making sales wait on the next poll/refresh.
  if (updated) await publishOrderUpdate(env, orgId, updated);
}

webhooksRoutes.post("/sepay", async (c) => {
  const db = createDbFromEnv(c.env);
  const rawBody = await c.req.text();
  const authorization = c.req.header("authorization") ?? "";

  const connection = await resolveConnection(db, c.env, authorization);
  if (!connection) throw new ApiError(401, "invalid_webhook_secret");

  let event: payments.VerifiedPaymentEvent;
  try {
    event = await sepayDriver.verifyWebhook({
      headers: { authorization },
      rawBody,
      connection: {
        provider: "sepay",
        apiKey: connection.apiKey,
        bankBin: connection.bankBin,
        accountNumber: connection.accountNumber
      }
    });
  } catch (err) {
    if (err instanceof payments.PaymentWebhookVerificationError) {
      throw new ApiError(400, "invalid_webhook_payload", err.message);
    }
    throw err;
  }

  const existingPayment = await paymentsRepository.findByProviderTx(
    db,
    connection.orgId,
    "sepay",
    event.providerTxId
  );
  if (existingPayment) return c.json({ ok: true, alreadyProcessed: true });

  const prefixes = await resolveTransferPrefixes(db, connection.orgId);
  const result = await matchAcrossPrefixes(
    db,
    connection.orgId,
    event,
    prefixes
  );

  if (result.outcome === "matched") {
    await recordMatch(db, c.env, connection.orgId, event, result);
  } else {
    await unmatchedTransactionsRepository.insert(db, connection.orgId, {
      providerTxId: event.providerTxId,
      rawPayload: event.rawPayload,
      reason: result.reason,
      candidateOrderIds: result.candidateOrderIds,
      status: "pending"
    });
    // FR-D-14 double-match/overpayment: a new transaction landing on an order already
    // paid/refunded must never re-trigger fulfillment — track it as a refund to hand back
    // instead, flagged for sales to work through FR-D-11..13 by hand.
    if (result.reason === "already_paid") {
      const [orderId] = result.candidateOrderIds;
      if (orderId) {
        await refundRequestsRepository.insert(db, connection.orgId, {
          orderId,
          paymentId: null,
          reason: "duplicate_payment",
          amount: String(event.amount),
          remitterInfo: {},
          status: "pending"
        });
      }
    }
  }

  return c.json({ ok: true });
});
