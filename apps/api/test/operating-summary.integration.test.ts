import { fileURLToPath } from "node:url";

import {
  campaignsRepository,
  generateCampaignPublicId,
  leadsRepository,
  ordersRepository,
  schema,
  unmatchedTransactionsRepository
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
 * `GET /api/leads/operating-summary` — the "Hôm nay" home screen's data source
 * (docs/product/decisions.md D-003). Regression coverage for a real bug fixed 2026-09-04: the
 * route computed `end` as a bare clone of the UTC-midnight `start` (same instant), so every
 * `gte(start) AND lte(end)` "today" filter matched nothing — leads/orders/pendingFulfillment
 * counts (and the `nextActions` entries derived from them) were always 0 regardless of real
 * activity created today. Also covers the `nextActions` priority order locked in
 * docs/product/roadmap.md §Lớp 1: fulfillment > lead > payment.
 */

let container: StartedPostgreSqlContainer;
let bindings: Bindings;
let rawDb: ReturnType<typeof drizzle>;
const app = createApp();

interface Organization {
  id: string;
}

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:18-alpine").start();
  const connectionUri = container.getConnectionUri();

  const migratorClient = postgres(connectionUri, { max: 1 });
  rawDb = drizzle(migratorClient, { schema });
  await migrate(rawDb, {
    migrationsFolder: fileURLToPath(
      new URL("../../../packages/db/migrations", import.meta.url)
    ).replaceAll("\\", "/")
  });

  bindings = {
    UPSTASH_REDIS_URL: "unused",
    UPSTASH_REDIS_TOKEN: "unused",
    DATABASE_URL: connectionUri,
    BETTER_AUTH_SECRET: "test-secret-at-least-32-chars-long!!",
    BETTER_AUTH_URL: "http://localhost:3000",
    APP_URL: "http://localhost:5173",
    RESEND_API_KEY: "test-key",
    RUNTIME: "bun",
    AI_KEY_MASTER_SECRET: "test-ai-key-master-secret-32-chars!!",
    PAYMENTS_KEY_MASTER_SECRET: "test-payments-key-master-secret-32ch",
    WEBHOOK_KEY_MASTER_SECRET: "test-webhook-key-master-secret-32ch!",
    TURNSTILE_SECRET_KEY: "test-turnstile-secret-key",
    TURNSTILE_SITE_KEY: "test-turnstile-site-key",
    PLATFORM_OPENROUTER_API_KEY: "test-openrouter-api-key",
    PUBLISH_BASE_DOMAIN: "test.example.com"
  };
}, 60_000);

afterAll(async () => {
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

function syncCookie(cookie: string, res: Response): string {
  const fresh = res.headers.getSetCookie();
  if (fresh.length === 0) return cookie;
  const jar = new Map(
    cookie
      .split("; ")
      .filter(Boolean)
      .map((kv) => {
        const i = kv.indexOf("=");
        return [kv.slice(0, i), kv.slice(i + 1)] as const;
      })
  );
  for (const setCookie of fresh) {
    const kv = setCookie.split(";")[0] ?? "";
    const i = kv.indexOf("=");
    jar.set(kv.slice(0, i), kv.slice(i + 1));
  }
  return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
}

describe("GET /api/leads/operating-summary", () => {
  let cookie: string;
  let org: Organization;
  let db: ReturnType<typeof createDbFromEnv>;

  beforeAll(async () => {
    db = createDbFromEnv(bindings);
    cookie = await signUpAndSignIn(
      "owner-summary@donve.test",
      "pw-summary-123456",
      "Owner Summary"
    );
    const createOrg = await authed(cookie, "/api/auth/organization/create", {
      method: "POST",
      body: JSON.stringify({ name: "Org Summary", slug: "org-summary-test" })
    });
    expect(createOrg.status).toBe(200);
    org = (await createOrg.json()) as Organization;
    const setActive = await authed(
      cookie,
      "/api/auth/organization/set-active",
      {
        method: "POST",
        body: JSON.stringify({ organizationId: org.id })
      }
    );
    cookie = syncCookie(cookie, setActive);
  });

  it("counts a lead and a paid order created just now as 'today', and orders nextActions by urgency", async () => {
    const campaign = await campaignsRepository.insert(db, org.id, {
      name: `Campaign ${crypto.randomUUID()}`,
      publicId: generateCampaignPublicId(`Campaign ${crypto.randomUUID()}`),
      paymentConfig: { enabled: true }
    });
    if (!campaign) throw new Error("expected seeded campaign");

    const lead = await leadsRepository.insert(db, org.id, {
      campaignId: campaign.id,
      fullName: "Summary Lead",
      phone: `09${Math.floor(Math.random() * 1e8)
        .toString()
        .padStart(8, "0")}`,
      stage: "new",
      assigneeId: null
    });
    if (!lead) throw new Error("expected seeded lead");

    const order = await ordersRepository.insert(db, org.id, {
      code: `ORD-${crypto.randomUUID().slice(0, 8)}`,
      leadId: lead.id,
      campaignId: campaign.id,
      amount: "150000",
      status: "paid",
      paidAt: new Date()
    });
    if (!order) throw new Error("expected seeded order");

    await unmatchedTransactionsRepository.insert(db, org.id, {
      providerTxId: `tx-${crypto.randomUUID()}`,
      rawPayload: {},
      reason: "no_candidate",
      status: "pending"
    });

    const res = await authed(cookie, "/api/leads/operating-summary");
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      leads: number;
      pendingFulfillment: number;
      unresolvedPayments: number;
      nextActions: { kind: string; count: number }[];
    };

    // Regression: before the date-range fix, these were always 0.
    expect(body.leads).toBeGreaterThanOrEqual(1);
    expect(body.pendingFulfillment).toBeGreaterThanOrEqual(1);
    expect(body.unresolvedPayments).toBeGreaterThanOrEqual(1);

    // Priority order: fulfillment (money already collected) before lead before payment.
    const kinds = body.nextActions.map((a) => a.kind);
    expect(kinds.indexOf("fulfillment")).toBeLessThan(kinds.indexOf("lead"));
    expect(kinds.indexOf("lead")).toBeLessThan(kinds.indexOf("payment"));
  });
});
