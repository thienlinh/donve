import { fileURLToPath } from "node:url";

import {
  campaignsRepository,
  generateCampaignPublicId,
  leadsRepository,
  ordersRepository,
  refundRequestsRepository,
  schema
} from "@dv/db";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer
} from "@testcontainers/postgresql";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { createDbFromEnv } from "../src/lib/db.js";
import type { Bindings } from "../src/types.js";

/**
 * FR-D-11..13: order detail "Yêu cầu hoàn tiền" action -> manual checklist -> order settles to
 * `refunded`. Non-custodial (business-analysis.md §4.4) — the platform only tracks the refund,
 * it never moves money itself, so there's no payout side effect to assert here beyond the
 * order/refundRequests state transitions and the activity log entry.
 *
 * FR-D-14's double-match auto-creation path is exercised separately in
 * webhooks-sepay.integration.test.ts (it needs the webhook route, not this one).
 */

let container: StartedPostgreSqlContainer;
let bindings: Bindings;
let rawDb: ReturnType<typeof drizzle>;
const app = createApp();
const originalFetch = globalThis.fetch;
const FAKE_UPSTASH_URL = "https://fake-upstash.test";

interface Organization {
  id: string;
}

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:17-alpine").start();
  const connectionUri = container.getConnectionUri();

  const migratorClient = postgres(connectionUri, { max: 1 });
  rawDb = drizzle(migratorClient, { schema });
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
    RUNTIME: "bun"
  };

  // refund completion publishes to the dashboard SSE hub via the real `@upstash/redis` REST
  // client (packages/drivers) — stub its HTTP calls the same way webhooks-sepay's suite does.
  globalThis.fetch = async (input, init) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    if (url.startsWith(FAKE_UPSTASH_URL)) {
      return new Response(JSON.stringify([{ result: 1 }]), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    if (url.startsWith("https://api.resend.com")) {
      return new Response(JSON.stringify({ id: "test-email-id" }), {
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

async function req(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type"))
    headers.set("content-type", "application/json");
  return app.fetch(
    new Request(`http://localhost${path}`, { ...init, headers }),
    bindings
  );
}

async function signUpAndSignIn(email: string, password: string, name: string) {
  const signUpRes = await req("/api/auth/sign-up/email", {
    method: "POST",
    body: JSON.stringify({ email, password, name })
  });
  if (!signUpRes.ok) {
    throw new Error(
      `sign-up failed: ${signUpRes.status} ${await signUpRes.text()}`
    );
  }

  await rawDb
    .update(schema.user)
    .set({ emailVerified: true })
    .where(eq(schema.user.email, email));

  const signInRes = await req("/api/auth/sign-in/email", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  if (!signInRes.ok) {
    throw new Error(
      `sign-in failed: ${signInRes.status} ${await signInRes.text()}`
    );
  }
  const cookie = signInRes.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  if (!cookie) throw new Error("sign-in did not return a session cookie");
  return cookie;
}

async function authed(cookie: string, path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("cookie", cookie);
  return req(path, { ...init, headers });
}

describe("POST/PATCH /api/payments/orders/:orderId/refund-requests (FR-D-11..13)", () => {
  let cookie: string;
  let org: Organization;
  let db: ReturnType<typeof createDbFromEnv>;

  beforeAll(async () => {
    db = createDbFromEnv(bindings);
    cookie = await signUpAndSignIn(
      "owner-refund@donve.test",
      "pw-refund-123456",
      "Owner Refund"
    );
    const createOrg = await authed(cookie, "/api/auth/organization/create", {
      method: "POST",
      body: JSON.stringify({ name: "Org Refund", slug: "org-refund-test" })
    });
    expect(createOrg.status).toBe(200);
    org = (await createOrg.json()) as Organization;
  });

  async function seedOrder(status: "pending" | "paid" | "fulfilled") {
    const campaign = await campaignsRepository.insert(db, org.id, {
      name: `Campaign ${crypto.randomUUID()}`,
      publicId: generateCampaignPublicId(`Campaign ${crypto.randomUUID()}`),
      paymentConfig: { enabled: true }
    });
    if (!campaign) throw new Error("expected seeded campaign");
    const lead = await leadsRepository.insert(db, org.id, {
      campaignId: campaign.id,
      fullName: "Refund Lead",
      phone: `09${Math.floor(Math.random() * 1e8)}`,
      stage: "new",
      assigneeId: null
    });
    if (!lead) throw new Error("expected seeded lead");
    const order = await ordersRepository.insert(db, org.id, {
      code: `ORD-${crypto.randomUUID().slice(0, 8)}`,
      leadId: lead.id,
      campaignId: campaign.id,
      amount: "150000",
      status
    });
    if (!order) throw new Error("expected seeded order");
    return order;
  }

  it("rejects creating a refund request for an order that hasn't been paid", async () => {
    const order = await seedOrder("pending");

    const res = await authed(
      cookie,
      `/api/payments/orders/${order.id}/refund-requests`,
      {
        method: "POST",
        body: JSON.stringify({ reason: "customer_request" })
      }
    );
    expect(res.status).toBe(400);
  });

  it("full lifecycle: create -> fill in remitter info -> complete -> order refunded", async () => {
    const order = await seedOrder("paid");

    const createRes = await authed(
      cookie,
      `/api/payments/orders/${order.id}/refund-requests`,
      {
        method: "POST",
        body: JSON.stringify({ reason: "customer_request" })
      }
    );
    expect(createRes.status).toBe(201);
    const created = (await createRes.json()) as {
      id: string;
      status: string;
      amount: number;
    };
    expect(created.status).toBe("pending");
    expect(created.amount).toBe(150_000);

    const patchRes = await authed(
      cookie,
      `/api/payments/refund-requests/${created.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          remitterInfo: { name: "Nguyen Van A", accountNumber: "0123456789" }
        })
      }
    );
    expect(patchRes.status).toBe(200);
    const patched = (await patchRes.json()) as {
      remitterInfo: { name?: string };
    };
    expect(patched.remitterInfo.name).toBe("Nguyen Van A");

    const completeRes = await authed(
      cookie,
      `/api/payments/refund-requests/${created.id}/complete`,
      { method: "POST" }
    );
    expect(completeRes.status).toBe(200);
    const completed = (await completeRes.json()) as { status: string };
    expect(completed.status).toBe("completed");

    const updatedOrder = await ordersRepository.findById(db, org.id, order.id);
    expect(updatedOrder?.status).toBe("refunded");

    // re-completing an already-settled request is rejected, order stays refunded
    const secondComplete = await authed(
      cookie,
      `/api/payments/refund-requests/${created.id}/complete`,
      { method: "POST" }
    );
    expect(secondComplete.status).toBe(409);

    const list = await refundRequestsRepository.listForOrder(
      db,
      org.id,
      order.id
    );
    expect(list).toHaveLength(1);
    expect(list[0]?.status).toBe("completed");
  });

  it("edge case: an unauthenticated request is rejected before any org check", async () => {
    const order = await seedOrder("paid");
    const res = await req(`/api/payments/orders/${order.id}/refund-requests`, {
      method: "POST",
      body: JSON.stringify({ reason: "customer_request" })
    });
    expect(res.status).toBe(401);
  });
});
