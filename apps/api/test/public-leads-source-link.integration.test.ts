import { fileURLToPath } from "node:url";

import {
  campaignsRepository,
  generateCampaignPublicId,
  leadsRepository,
  ordersRepository,
  sourceLinksRepository,
  schema
} from "@dv/db";
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
 * Source-link attribution (see packages/db/src/schema/analytics.ts's `sourceLinks`) — a lead
 * submitted through `POST /public/leads` with UTM params matching a created source link must
 * resolve `sourceLinkId`, and an order created off that lead must inherit it. Drives the real
 * mounted app (real Postgres via testcontainers) since the matching lives in
 * `findOrCreateLead`/`maybeCreateOrder`, not in a unit-testable pure function.
 */

let container: StartedPostgreSqlContainer;
let bindings: Bindings;
const app = createApp();
const originalFetch = globalThis.fetch;

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

  // The route verifies the Turnstile token server-side against Cloudflare's siteverify
  // endpoint — stub it to always succeed, this suite isn't testing anti-spam.
  globalThis.fetch = async (input, init) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    if (url.startsWith("https://challenges.cloudflare.com")) {
      return new Response(JSON.stringify({ success: true }), {
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

describe("POST /public/leads source-link attribution", () => {
  let db: ReturnType<typeof createDbFromEnv>;
  let orgId: string;
  let campaignId: string;

  beforeAll(async () => {
    db = createDbFromEnv(bindings);
    orgId = crypto.randomUUID();
    const campaign = await campaignsRepository.insert(db, orgId, {
      name: "Source Link Campaign",
      publicId: generateCampaignPublicId(`Source Link Campaign ${orgId}`),
      paymentConfig: {
        enabled: true,
        amountSource: "fixed",
        fixedAmount: 100_000,
        bankBin: "970422",
        accountNumber: "0123456789"
      }
    });
    if (!campaign) throw new Error("expected seeded campaign");
    campaignId = campaign.id;

    await sourceLinksRepository.insert(db, orgId, {
      campaignId,
      name: "Facebook post A",
      key: "fb-post-a",
      utmSource: "facebook",
      utmMedium: "social",
      utmCampaign: "launch",
      utmContent: "post-a",
      targetUrl: "https://example.com/lp?utm_source=facebook"
    });
  });

  it("resolves sourceLinkId on the lead and propagates it to the created order when UTM matches a source link", async () => {
    const res = await req("/public/leads", {
      method: "POST",
      body: JSON.stringify({
        orgId,
        campaignId,
        fullName: "Nguyen Van A",
        phone: `09${Math.floor(Math.random() * 1e8)
          .toString()
          .padStart(8, "0")}`,
        customFields: {},
        utm: {
          utm_source: "facebook",
          utm_medium: "social",
          utm_campaign: "launch",
          utm_content: "post-a"
        },
        consent: true,
        honeypot: "",
        turnstileToken: "test-token"
      })
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as {
      leadId: string;
      order: { orderCode: string } | null;
    };

    const link = await sourceLinksRepository.findByCampaignAndKey(
      db,
      orgId,
      campaignId,
      "fb-post-a"
    );
    if (!link) throw new Error("expected seeded source link");

    const lead = await leadsRepository.findById(db, orgId, body.leadId);
    expect(lead?.sourceLinkId).toBe(link.id);

    expect(body.order).not.toBeNull();
    const orders = await ordersRepository.listForLead(db, orgId, body.leadId);
    expect(orders[0]?.sourceLinkId).toBe(link.id);
  });

  it("leaves sourceLinkId null when UTM doesn't match any created source link (direct traffic)", async () => {
    const res = await req("/public/leads", {
      method: "POST",
      body: JSON.stringify({
        orgId,
        campaignId,
        fullName: "Nguyen Van B",
        phone: `09${Math.floor(Math.random() * 1e8)
          .toString()
          .padStart(8, "0")}`,
        customFields: {},
        utm: {},
        consent: true,
        honeypot: "",
        turnstileToken: "test-token"
      })
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as { leadId: string };

    const lead = await leadsRepository.findById(db, orgId, body.leadId);
    expect(lead?.sourceLinkId).toBeNull();

    const orders = await ordersRepository.listForLead(db, orgId, body.leadId);
    expect(orders[0]?.sourceLinkId).toBeNull();
  });
});
