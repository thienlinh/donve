import { fileURLToPath } from "node:url";

import { encryptApiKey, importMasterKey } from "@dv/ai-gateway";
import {
  campaignsRepository,
  generateCampaignPublicId,
  leadsRepository,
  ordersRepository,
  paymentConnectionsRepository,
  paymentsRepository,
  refundRequestsRepository,
  schema,
  unmatchedTransactionsRepository
} from "@dv/db";
import { payments } from "@dv/drivers";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer
} from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { createDbFromEnv } from "../src/lib/db.js";
import type { Bindings } from "../src/types.js";

/**
 * FR-D-05 / architecture.md §7 "Webhook giả mạo SePay": exercises the real mounted
 * `/webhooks/sepay` route end-to-end (real Postgres via testcontainers) — no auth/org
 * signup needed, `orgId` columns here have no FK to `organizations` (see schema/crm.ts),
 * so fixtures are seeded straight through the repositories with a bare string orgId.
 */

let container: StartedPostgreSqlContainer;
let bindings: Bindings;
const app = createApp();
const originalFetch = globalThis.fetch;

// 32 raw bytes, base64url — matches `importMasterKey`'s expected format.
const MASTER_SECRET = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const SEPAY_API_KEY = "sepay-webhook-secret-123";
const TRANSFER_PREFIX = "DV";
const FAKE_UPSTASH_URL = "https://fake-upstash.test";

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:18-alpine").start();
  const connectionUri = container.getConnectionUri();

  const migratorClient = postgres(connectionUri, { max: 1 });
  const rawDb = drizzle(migratorClient, { schema });
  await migrate(rawDb, {
    migrationsFolder: fileURLToPath(
      new URL("../../../packages/db/migrations", import.meta.url)
    ).replaceAll("\\", "/")
  });

  bindings = {
    UPSTASH_REDIS_URL: FAKE_UPSTASH_URL,
    UPSTASH_REDIS_TOKEN: "test-token",
    DATABASE_URL: connectionUri,
    BETTER_AUTH_SECRET: "test-secret-at-least-32-chars-long!!",
    BETTER_AUTH_URL: "http://localhost:3000",
    DASHBOARD_URL: "http://localhost:5173",
    RESEND_API_KEY: "test-key",
    RUNTIME: "bun",
    PAYMENTS_KEY_MASTER_SECRET: MASTER_SECRET,
    AI_KEY_MASTER_SECRET: MASTER_SECRET,
    WEBHOOK_KEY_MASTER_SECRET: MASTER_SECRET,
    TURNSTILE_SECRET_KEY: "test-turnstile",
    TURNSTILE_SITE_KEY: "test-turnstile-site",
    PLATFORM_OPENROUTER_API_KEY: "test-openrouter",
    PUBLISH_BASE_DOMAIN: "test.local"
  };

  // /webhooks/* is rate-limited via the real `@upstash/redis` REST client (packages/drivers) —
  // stub its HTTP calls the same way the cross-tenant suite stubs Resend, always well under limit.
  globalThis.fetch = async (input, init) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    if (url.startsWith(FAKE_UPSTASH_URL)) {
      // the nodejs entrypoint's `Redis` client auto-pipelines every command (see
      // `createAutoPipelineProxy` in @upstash/redis) — every request lands on `/pipeline`
      // and expects an array with one `{result}` per batched command.
      return new Response(JSON.stringify([{ result: 1 }]), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    return originalFetch(input, init);
  };
}, 60_000);

afterAll(async () => {
  globalThis.fetch = originalFetch;
  await container.stop();
});

function db() {
  return createDbFromEnv(bindings);
}

/**
 * Each seeded org gets its own secret (never `SEPAY_API_KEY` verbatim) — every org's
 * webhook secret must be distinct for `resolveConnection`'s decrypt-and-scan to resolve
 * the right org, same as production (each org connects its own SePay account).
 */
function orgApiKey(orgId: string): string {
  return `${SEPAY_API_KEY}-${orgId}`;
}

async function seedOrg(orgId: string) {
  const masterKey = await importMasterKey(bindings.PAYMENTS_KEY_MASTER_SECRET);
  const encryptedApiKey = await encryptApiKey(orgApiKey(orgId), masterKey);
  await paymentConnectionsRepository.insert(db(), orgId, {
    provider: "sepay",
    encryptedApiKey,
    bankBin: "970422",
    accountNumber: "0123456789",
    accountName: "DONVE TEST",
    status: "active"
  });

  const campaign = await campaignsRepository.insert(db(), orgId, {
    name: "Test campaign",
    publicId: generateCampaignPublicId("Test campaign"),
    paymentConfig: { enabled: true, transferPrefix: TRANSFER_PREFIX }
  });
  if (!campaign) throw new Error("expected seeded campaign");

  const lead = await leadsRepository.insert(db(), orgId, {
    campaignId: campaign.id,
    fullName: "Test Lead",
    phone: `09${Math.floor(Math.random() * 1e8)}`,
    stage: "new",
    assigneeId: null
  });
  if (!lead) throw new Error("expected seeded lead");

  return { campaign, lead };
}

async function seedOrder(
  orgId: string,
  campaignId: string,
  leadId: string,
  amount: number,
  status: "pending" | "paid" = "pending",
  // forced to start with "0" so tests exercising the confusable-typo table (O/I/S/B) have
  // something to actually correct — a fully random data string may contain none of them.
  data = `0${payments.generateOrderCodeData().slice(1)}`
) {
  const code = TRANSFER_PREFIX + payments.encodeOrderCode(data);
  const order = await ordersRepository.insert(db(), orgId, {
    code,
    leadId,
    campaignId,
    amount: String(amount),
    status
  });
  if (!order) throw new Error("expected seeded order");
  return order;
}

async function postWebhook(
  apiKey: string,
  payload: { id: string; transferAmount: number; content: string }
) {
  return app.fetch(
    new Request("http://localhost/webhooks/sepay", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Apikey ${apiKey}`
      },
      body: JSON.stringify({
        ...payload,
        transactionDate: "2026-08-20T10:00:00Z"
      })
    }),
    bindings
  );
}

describe("POST /webhooks/sepay (FR-D-05)", () => {
  it("rejects a request with the wrong secret (401), no rows written", async () => {
    const orgId = crypto.randomUUID();
    await seedOrg(orgId);

    const res = await postWebhook("wrong-secret", {
      id: `tx-${crypto.randomUUID()}`,
      transferAmount: 100_000,
      content: "no order code here"
    });
    expect(res.status).toBe(401);
  });

  it("step 1 exact match: auto-matches, marks the order paid, records the payment", async () => {
    const orgId = crypto.randomUUID();
    const { campaign, lead } = await seedOrg(orgId);
    const order = await seedOrder(orgId, campaign.id, lead.id, 100_000);
    const txId = `tx-${crypto.randomUUID()}`;

    const res = await postWebhook(orgApiKey(orgId), {
      id: txId,
      transferAmount: 100_000,
      content: `CT tu 0123456 ${order.code} chuyen khoan`
    });
    expect(res.status).toBe(200);

    const updated = await ordersRepository.findById(db(), orgId, order.id);
    expect(updated?.status).toBe("paid");

    const payment = await paymentsRepository.findByProviderTx(
      db(),
      orgId,
      "sepay",
      txId
    );
    expect(payment?.matchType).toBe("auto");
    expect(payment?.orderId).toBe(order.id);
  });

  it("step 2 fuzzy match: typo'd order code (O/I/S/B confusables) still auto-matches", async () => {
    const orgId = crypto.randomUUID();
    const { campaign, lead } = await seedOrg(orgId);
    const order = await seedOrder(orgId, campaign.id, lead.id, 50_000);
    const typo = order.code
      .replace(/0/g, "O")
      .replace(/1/g, "I")
      .replace(/5/g, "S")
      .replace(/8/g, "B");
    // sanity: the fuzzy pass only matters if the typo actually changed the string
    expect(typo).not.toBe(order.code);
    const txId = `tx-${crypto.randomUUID()}`;

    const res = await postWebhook(orgApiKey(orgId), {
      id: txId,
      transferAmount: 50_000,
      content: `${typo} thanh toan`
    });
    expect(res.status).toBe(200);

    const updated = await ordersRepository.findById(db(), orgId, order.id);
    expect(updated?.status).toBe("paid");

    const payment = await paymentsRepository.findByProviderTx(
      db(),
      orgId,
      "sepay",
      txId
    );
    expect(payment?.matchType).toBe("fuzzy");
  });

  it("amount mismatch never auto-matches even with a checksum-valid code (no tolerance band)", async () => {
    const orgId = crypto.randomUUID();
    const { campaign, lead } = await seedOrg(orgId);
    const order = await seedOrder(orgId, campaign.id, lead.id, 100_000);
    const txId = `tx-${crypto.randomUUID()}`;

    const res = await postWebhook(orgApiKey(orgId), {
      id: txId,
      transferAmount: 99_999,
      content: `${order.code} chuyen tien`
    });
    expect(res.status).toBe(200);

    const updated = await ordersRepository.findById(db(), orgId, order.id);
    expect(updated?.status).toBe("pending");

    const unmatched = await unmatchedTransactionsRepository.list(db(), orgId);
    const row = unmatched.find((u) => u.providerTxId === txId);
    expect(row?.reason).toBe("no_candidate");
  });

  it("branch no_candidate: content has no valid order code", async () => {
    const orgId = crypto.randomUUID();
    await seedOrg(orgId);
    const txId = `tx-${crypto.randomUUID()}`;

    const res = await postWebhook(orgApiKey(orgId), {
      id: txId,
      transferAmount: 100_000,
      content: "chuyen tien khong co ma don"
    });
    expect(res.status).toBe(200);

    const unmatched = await unmatchedTransactionsRepository.list(db(), orgId);
    const row = unmatched.find((u) => u.providerTxId === txId);
    expect(row?.reason).toBe("no_candidate");
    expect(row?.candidateOrderIds).toEqual([]);
  });

  it("branch ambiguous: two eligible orders both match distinct codes in the same content", async () => {
    const orgId = crypto.randomUUID();
    const { campaign, lead } = await seedOrg(orgId);
    const orderX = await seedOrder(orgId, campaign.id, lead.id, 100_000);
    const orderY = await seedOrder(orgId, campaign.id, lead.id, 100_000);
    const txId = `tx-${crypto.randomUUID()}`;

    const res = await postWebhook(orgApiKey(orgId), {
      id: txId,
      transferAmount: 100_000,
      content: `${orderX.code} va ${orderY.code} deu duoc nhac toi`
    });
    expect(res.status).toBe(200);

    const stillX = await ordersRepository.findById(db(), orgId, orderX.id);
    const stillY = await ordersRepository.findById(db(), orgId, orderY.id);
    expect(stillX?.status).toBe("pending");
    expect(stillY?.status).toBe("pending");

    const unmatched = await unmatchedTransactionsRepository.list(db(), orgId);
    const row = unmatched.find((u) => u.providerTxId === txId);
    expect(row?.reason).toBe("ambiguous");
    expect(row?.candidateOrderIds).toEqual(
      expect.arrayContaining([orderX.id, orderY.id])
    );
  });

  it("branch already_paid: the matched order was already paid/refunded (FR-D-14 double-match)", async () => {
    const orgId = crypto.randomUUID();
    const { campaign, lead } = await seedOrg(orgId);
    const order = await seedOrder(orgId, campaign.id, lead.id, 100_000, "paid");
    const txId = `tx-${crypto.randomUUID()}`;

    const res = await postWebhook(orgApiKey(orgId), {
      id: txId,
      transferAmount: 100_000,
      content: `${order.code} thanh toan lan 2`
    });
    expect(res.status).toBe(200);

    const unmatched = await unmatchedTransactionsRepository.list(db(), orgId);
    const row = unmatched.find((u) => u.providerTxId === txId);
    expect(row?.reason).toBe("already_paid");
    expect(row?.candidateOrderIds).toEqual([order.id]);

    const stillPaid = await ordersRepository.findById(db(), orgId, order.id);
    expect(stillPaid?.status).toBe("paid");
  });

  describe("FR-D-14 double-match auto-creates a refundRequests row", () => {
    it("auto-creates a pending duplicate_payment refund request, does not re-fulfill the order", async () => {
      const orgId = crypto.randomUUID();
      const { campaign, lead } = await seedOrg(orgId);
      const order = await seedOrder(
        orgId,
        campaign.id,
        lead.id,
        100_000,
        "paid"
      );
      const txId = `tx-${crypto.randomUUID()}`;

      const res = await postWebhook(orgApiKey(orgId), {
        id: txId,
        transferAmount: 100_000,
        content: `${order.code} thanh toan lan 2`
      });
      expect(res.status).toBe(200);

      // order stays exactly as-is — no re-fulfillment, no status change of any kind
      const stillPaid = await ordersRepository.findById(db(), orgId, order.id);
      expect(stillPaid?.status).toBe("paid");
      expect(stillPaid?.fulfilledAt).toBeNull();

      const refundRequests = await refundRequestsRepository.listForOrder(
        db(),
        orgId,
        order.id
      );
      expect(refundRequests).toHaveLength(1);
      expect(refundRequests[0]).toMatchObject({
        orderId: order.id,
        reason: "duplicate_payment",
        status: "pending"
      });
      expect(Number(refundRequests[0]?.amount)).toBe(100_000);

      // no payment row recorded for the duplicate transaction — it was never "matched"
      const payment = await paymentsRepository.findByProviderTx(
        db(),
        orgId,
        "sepay",
        txId
      );
      expect(payment).toBeUndefined();
    });

    it("also fires when the candidate order was already refunded, not just paid", async () => {
      const orgId = crypto.randomUUID();
      const { campaign, lead } = await seedOrg(orgId);
      const order = await seedOrder(
        orgId,
        campaign.id,
        lead.id,
        100_000,
        "paid"
      );
      await ordersRepository.update(db(), orgId, order.id, {
        status: "refunded"
      });
      const txId = `tx-${crypto.randomUUID()}`;

      const res = await postWebhook(orgApiKey(orgId), {
        id: txId,
        transferAmount: 100_000,
        content: `${order.code} chuyen nham lan nua`
      });
      expect(res.status).toBe(200);

      const stillRefunded = await ordersRepository.findById(
        db(),
        orgId,
        order.id
      );
      expect(stillRefunded?.status).toBe("refunded");

      const refundRequests = await refundRequestsRepository.listForOrder(
        db(),
        orgId,
        order.id
      );
      expect(refundRequests).toHaveLength(1);
      expect(refundRequests[0]?.reason).toBe("duplicate_payment");
      expect(refundRequests[0]?.status).toBe("pending");
    });
  });

  it("is idempotent by providerTxId: a retried delivery for an already-recorded tx is a no-op", async () => {
    const orgId = crypto.randomUUID();
    const { campaign, lead } = await seedOrg(orgId);
    const order = await seedOrder(orgId, campaign.id, lead.id, 100_000);
    const txId = `tx-${crypto.randomUUID()}`;
    const payload = {
      id: txId,
      transferAmount: 100_000,
      content: `${order.code} chuyen khoan`
    };

    const first = await postWebhook(orgApiKey(orgId), payload);
    expect(first.status).toBe(200);

    const second = await postWebhook(orgApiKey(orgId), payload);
    expect(second.status).toBe(200);
    expect(await second.json()).toEqual({ ok: true, alreadyProcessed: true });

    const payments_ = await paymentsRepository.list(db(), orgId);
    expect(payments_.filter((p) => p.providerTxId === txId)).toHaveLength(1);
  });
});
