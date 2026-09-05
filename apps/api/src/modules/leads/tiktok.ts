import { encryptApiKey, importMasterKey } from "@dv/ai-gateway";
import { campaignsRepository, tiktokConnectionsRepository } from "@dv/db";
import { Hono, type Context } from "hono";
import { z } from "zod";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { timingSafeEqual } from "@/lib/timing-safe-equal.js";
import type { AppEnv } from "@/types.js";

import {
  captureIngestionFailure,
  ingestWebhookLead,
  type MappedLead
} from "./webhooks.js";

const TIKTOK_API_BASE = "https://business-api.tiktok.com/open_api/v1.3";

function requireTiktokAppCredentials(env: AppEnv["Bindings"]): {
  appId: string;
  secret: string;
} {
  if (!env.TIKTOK_APP_ID || !env.TIKTOK_APP_SECRET) {
    throw new ApiError(501, "tiktok_app_not_configured");
  }
  return { appId: env.TIKTOK_APP_ID, secret: env.TIKTOK_APP_SECRET };
}

const tiktokTokenResponseSchema = z.object({
  code: z.number(),
  data: z
    .object({
      access_token: z.string(),
      advertiser_ids: z.array(z.string()).default([])
    })
    .optional()
});

/** `POST /oauth2/access_token/` — exchanges the one-time `auth_code` TikTok appended to the
 * OAuth redirect for a long-term `access_token` (no `expires_in`/`refresh_token` in the
 * response per TikTok's own docs, confirmed against the official Authentication page — this is
 * deliberately not a short-lived-token-with-refresh flow like most OAuth integrations). */
async function exchangeAuthCodeForToken(
  env: AppEnv["Bindings"],
  authCode: string
): Promise<{ accessToken: string; advertiserIds: string[] }> {
  const { appId, secret } = requireTiktokAppCredentials(env);
  const res = await fetch(`${TIKTOK_API_BASE}/oauth2/access_token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, secret, auth_code: authCode })
  });
  const json: unknown = await res.json();
  const parsed = tiktokTokenResponseSchema.safeParse(json);
  if (!parsed.success || parsed.data.code !== 0 || !parsed.data.data) {
    throw new ApiError(502, "tiktok_oauth_exchange_failed");
  }
  return {
    accessToken: parsed.data.data.access_token,
    advertiserIds: parsed.data.data.advertiser_ids
  };
}

const tiktokSubscribeResponseSchema = z.object({
  code: z.number(),
  data: z.object({ subscription_id: z.string() }).optional()
});

/** `POST /subscription/subscribe/` with `subscribe_entity: "LEAD"` — registers Donve's shared
 * app + the advertiser's own `access_token` to receive real-time lead webhooks for one
 * `advertiser_id` (optionally narrowed to one `page_id`/Instant Form). `callback_url` is Donve's
 * fixed `/webhooks/tiktok-leads?orgId=..&campaignId=..`, the same `&campaignId=` convention every
 * other webhook route here uses. */
async function createLeadSubscription(
  env: AppEnv["Bindings"],
  params: {
    accessToken: string;
    advertiserId: string;
    pageId: string | null;
    callbackUrl: string;
  }
): Promise<string> {
  const { appId, secret } = requireTiktokAppCredentials(env);
  const res = await fetch(`${TIKTOK_API_BASE}/subscription/subscribe/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: appId,
      secret,
      subscribe_entity: "LEAD",
      callback_url: params.callbackUrl,
      subscription_detail: {
        access_token: params.accessToken,
        advertiser_id: params.advertiserId,
        ...(params.pageId ? { page_id: params.pageId } : {})
      }
    })
  });
  const json: unknown = await res.json();
  const parsed = tiktokSubscribeResponseSchema.safeParse(json);
  if (!parsed.success || parsed.data.code !== 0 || !parsed.data.data) {
    throw new ApiError(502, "tiktok_subscribe_failed");
  }
  return parsed.data.data.subscription_id;
}

/** `POST /subscription/unsubscribe/` — called when an org disconnects, so TikTok stops POSTing
 * to a callback URL nobody is listening for anymore. Best-effort: a failure here doesn't block
 * removing the local connection row, since an org disconnecting should never get stuck because
 * of a transient TikTok API error. */
async function cancelLeadSubscription(
  env: AppEnv["Bindings"],
  subscriptionId: string
): Promise<void> {
  const { appId, secret } = requireTiktokAppCredentials(env);
  await fetch(`${TIKTOK_API_BASE}/subscription/unsubscribe/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: appId,
      secret,
      subscription_id: subscriptionId
    })
  }).catch(() => undefined);
}

/**
 * Constant-time verification of TikTok's `Tiktok-Signature` header — confirmed against TikTok's
 * official Webhook verification doc (business-api.tiktok.com/portal/docs/webhook-verification).
 * Format: `t=<unix_seconds>,s=<hex_hmac_sha256>`. The signed payload is
 * `{timestamp}.{raw JSON body}` (NOT the body alone — the timestamp is part of what's signed,
 * so an attacker can't replay an old payload with a new timestamp), HMAC-SHA256 keyed by Donve's
 * own `TIKTOK_APP_SECRET` — unlike Facebook/Zalo/generic, TikTok signs with the platform-wide
 * APP secret, never a per-org one, because Donve (not each org) is the registered TikTok
 * developer app. `maxAgeSeconds` rejects a stale signature even if it's otherwise valid,
 * matching TikTok's own sample implementation's replay-protection step.
 */
export async function verifyTiktokSignature(
  secret: string,
  rawBody: string,
  header: string | undefined,
  maxAgeSeconds = 300
): Promise<boolean> {
  if (!secret || !header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=") as [string, string])
  );
  const timestamp = parts.t;
  const presented = parts.s;
  if (!timestamp || !presented) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signedPayload = `${timestamp}.${rawBody}`;
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedPayload)
  );
  const expectedHex = [...new Uint8Array(mac)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  if (!timingSafeEqual(expectedHex, presented)) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  return ageSeconds <= maxAgeSeconds;
}

const tiktokLeadChangeSchema = z.object({
  field: z.string(),
  value: z.unknown()
});

const tiktokLeadEntrySchema = z.object({
  id: z.string(),
  changes: z.array(tiktokLeadChangeSchema).default([])
});

const tiktokWebhookPayloadSchema = z.object({
  object: z.number(),
  entry: z.array(tiktokLeadEntrySchema).default([])
});

const KNOWN_NAME_FIELDS = new Set(["name", "full_name"]);
const KNOWN_PHONE_FIELDS = new Set(["phone_number", "phone"]);
const KNOWN_EMAIL_FIELDS = new Set(["email"]);

/** Maps one `entry[]` item's `changes` array (confirmed shape from TikTok's own documented
 * sample: `[{field:"phone_number", value:"..."}, {field:"email", value:"..."}, ...]`) to the
 * lead shape every ingestion path shares — same fallback-to-customFields behavior as Facebook's
 * `field_data` mapping. */
function mapTiktokLeadEntry(
  entry: z.infer<typeof tiktokLeadEntrySchema>
): MappedLead {
  let fullName = "";
  let phone = "";
  let email: string | null = null;
  const customFields: Record<string, unknown> = {};

  for (const change of entry.changes) {
    const value = typeof change.value === "string" ? change.value : "";
    if (KNOWN_NAME_FIELDS.has(change.field)) fullName = value;
    else if (KNOWN_PHONE_FIELDS.has(change.field)) phone = value;
    else if (KNOWN_EMAIL_FIELDS.has(change.field)) email = value || null;
    else customFields[change.field] = change.value;
  }
  return { fullName, phone, email, customFields };
}

function requireOrgAndCampaignQuery(c: Context<AppEnv>): {
  orgId: string;
  campaignId: string;
} {
  const orgId = c.req.query("orgId");
  const campaignId = c.req.query("campaignId");
  if (!orgId || !campaignId) {
    throw new ApiError(400, "missing_org_or_campaign_id");
  }
  return { orgId, campaignId };
}

export const tiktokWebhooksRoutes = new Hono<AppEnv>();

/**
 * TikTok's OAuth redirect target, configured as one of Donve's shared TikTok App's "advertiser
 * redirect URLs" (up to 10 allowed, per TikTok's Authorization doc). `state` carries
 * `<orgId>:<campaignId>` — Donve appends it to the App's own "Advertiser authorization URL"
 * before showing the "Connect TikTok Ads" link (no session exists here; TikTok's own servers
 * make this GET after the advertiser approves). Not mounted under `requireOrgSession` for the
 * same reason the other `/webhooks/*` routes aren't — this is TikTok redirecting the
 * advertiser's browser, not an app-authenticated request.
 */
tiktokWebhooksRoutes.get("/tiktok-oauth-callback", async (c) => {
  const state = c.req.query("state") ?? "";
  const authCode = c.req.query("auth_code") ?? c.req.query("code");
  const [orgId, campaignId] = state.split(":");
  if (!orgId || !campaignId || !authCode) {
    throw new ApiError(400, "invalid_tiktok_oauth_callback");
  }

  const { accessToken, advertiserIds } = await exchangeAuthCodeForToken(
    c.env,
    authCode
  );
  const advertiserId = advertiserIds[0];
  if (!advertiserId) throw new ApiError(502, "tiktok_no_advertiser_authorized");

  const db = createDbFromEnv(c.env);
  const campaign = await campaignsRepository.findById(db, orgId, campaignId);
  if (!campaign || campaign.deletedAt)
    throw new ApiError(404, "campaign_not_found");

  const apiBase = new URL(c.req.url).origin;
  const callbackUrl = `${apiBase}/webhooks/tiktok-leads?orgId=${encodeURIComponent(orgId)}&campaignId=${encodeURIComponent(campaignId)}`;
  const [subscriptionId, masterKey] = await Promise.all([
    createLeadSubscription(c.env, {
      accessToken,
      advertiserId,
      pageId: null,
      callbackUrl
    }),
    importMasterKey(c.env.WEBHOOK_KEY_MASTER_SECRET)
  ]);
  const encryptedAccessToken = await encryptApiKey(accessToken, masterKey);
  await tiktokConnectionsRepository.upsert(db, orgId, campaignId, {
    advertiserId,
    pageId: null,
    encryptedAccessToken,
    subscriptionId
  });

  return c.redirect(
    `${c.env.APP_URL}/leads/webhook-settings?tiktokConnected=1`
  );
});

/**
 * TikTok's real-time `LEAD` webhook — signed with `Tiktok-Signature` (Donve's own
 * `TIKTOK_APP_SECRET`, not a per-org secret, see `verifyTiktokSignature`). Unlike Facebook, the
 * full field data travels IN the webhook body already (`entry[].changes[]`), so there's no
 * second authenticated fetch step needed here — confirmed against TikTok's own documented
 * sample payload. Reuses `ingestWebhookLead` (dedupe/routing/consent/realtime — same as every
 * other source) once each `entry[]` item is mapped to the shared `MappedLead` shape.
 */
tiktokWebhooksRoutes.post("/tiktok-leads", async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header("tiktok-signature");
  const { orgId, campaignId } = requireOrgAndCampaignQuery(c);

  if (!c.env.TIKTOK_APP_SECRET) {
    throw new ApiError(501, "tiktok_app_not_configured");
  }
  const verified = await verifyTiktokSignature(
    c.env.TIKTOK_APP_SECRET,
    rawBody,
    signature
  );
  if (!verified) throw new ApiError(401, "invalid_webhook_signature");

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    throw new ApiError(400, "invalid_webhook_payload");
  }
  const parsed = tiktokWebhookPayloadSchema.safeParse(parsedJson);
  if (!parsed.success) throw new ApiError(400, "invalid_webhook_payload");

  // object: 1 = lead (TikTok's Subscription API also delivers other object types like ad review
  // status to the same callback_url shape if an org ever subscribes to more than LEAD) — only
  // lead entries are ingested here, everything else is acknowledged and ignored.
  if (parsed.data.object !== 1) return c.json({ ok: true, status: "ignored" });

  const results = await Promise.all(
    parsed.data.entry.map(async (entry) => {
      const mapped = mapTiktokLeadEntry(entry);
      try {
        const result = await ingestWebhookLead(
          c.env,
          orgId,
          campaignId,
          "tiktok",
          mapped
        );
        return { ok: true, ...result };
      } catch (err) {
        await captureIngestionFailure(
          c.env,
          orgId,
          campaignId,
          "tiktok",
          mapped,
          err
        );
        return { error: err instanceof ApiError ? err.code : "internal_error" };
      }
    })
  );
  return c.json({ ok: true, results });
});

/** Disconnects an org's TikTok Ads connection for one campaign — cancels the TikTok-side
 * subscription (best-effort) and removes the local row. Called from
 * `DELETE /api/leads/tiktok-connections/:campaignId` in routes.ts, not mounted here since that
 * route needs `requireOrgSession`/`requireAdminOrOwner` like every other Settings CRUD route. */
export async function disconnectTiktok(
  env: AppEnv["Bindings"],
  orgId: string,
  campaignId: string
): Promise<void> {
  const db = createDbFromEnv(env);
  const connection = await tiktokConnectionsRepository.findByOrgAndCampaign(
    db,
    orgId,
    campaignId
  );
  if (!connection) return;
  await cancelLeadSubscription(env, connection.subscriptionId);
  await tiktokConnectionsRepository.remove(db, orgId, campaignId);
}
