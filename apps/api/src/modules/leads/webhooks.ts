import { decryptApiKey, importMasterKey } from "@dv/ai-gateway";
import { genericLeadPayloadSchema, type LeadSource } from "@dv/contracts";
import {
  campaignsRepository,
  consentsRepository,
  webhookCredentialsRepository,
  webhookDeliveryFailuresRepository
} from "@dv/db";
import { Hono, type Context } from "hono";
import { z } from "zod";

import { createDbFromEnv } from "../../lib/db.js";
import { ApiError } from "../../lib/errors.js";
import { normalizeVnPhone } from "../../lib/phone.js";
import { publishNewLeads } from "../../lib/realtime.js";
import { timingSafeEqual } from "../../lib/timing-safe-equal.js";
import type { AppEnv } from "../../types.js";
import { CONSENT_POLICY_VERSION, findOrCreateLead } from "../public/routes.js";
import { routeLead } from "./routing.js";

type WebhookProvider = "facebook" | "zalo_oa";

/** `importMasterKey` is cheap (one `crypto.subtle.importKey` call) — no need to cache across
 * requests, same reasoning as `apps/api/src/lib/ai-gateway.ts`/`modules/payments/routes.ts`. */
function webhookMasterKey(env: AppEnv["Bindings"]) {
  return importMasterKey(env.WEBHOOK_KEY_MASTER_SECRET);
}

/**
 * Per-org secret with fallback to the shared env secret — the two-tier model that closes the
 * cross-org forgery gap documented in lead-integrations.md §4: the HMAC signature only ever
 * covers the request body, never the `orgId`/`campaignId` query params that pick the tenant, so
 * a single secret shared by every org meant anyone holding it could forge a valid signature for
 * ANY org by just changing the query params. An org that registers its own Facebook App/Zalo OA
 * (and stores its secret here, encrypted) is now isolated from every other org's traffic; an org
 * that hasn't configured one still works via the old shared-secret "one central app" model.
 */
export async function resolveWebhookSecret(
  env: AppEnv["Bindings"],
  orgId: string,
  provider: WebhookProvider
): Promise<string> {
  const db = createDbFromEnv(env);
  const credential = await webhookCredentialsRepository.findByOrgAndProvider(
    db,
    orgId,
    provider
  );
  if (credential) {
    const masterKey = await webhookMasterKey(env);
    return decryptApiKey(credential.encryptedSecret, masterKey);
  }
  return provider === "facebook"
    ? (env.FACEBOOK_APP_SECRET ?? "")
    : (env.ZALO_OA_SECRET ?? "");
}

/** `generic`/`google_ads` have no shared-secret fallback — unlike Facebook/Zalo's "one central
 * app" model, there is no such thing as a platform-wide default for a Donve-generated key, so
 * an org that hasn't generated one yet is correctly treated as "nothing can call this", not
 * silently allowed through. */
export async function resolveGeneratedApiKey(
  env: AppEnv["Bindings"],
  orgId: string,
  provider: "generic" | "google_ads"
): Promise<string | null> {
  const db = createDbFromEnv(env);
  const credential = await webhookCredentialsRepository.findByOrgAndProvider(
    db,
    orgId,
    provider
  );
  if (!credential) return null;
  const masterKey = await webhookMasterKey(env);
  return decryptApiKey(credential.encryptedSecret, masterKey);
}

/**
 * Multi-source lead ingestion (module E follow-up) — Facebook Lead Ads / Zalo OA webhooks.
 * Mounted at `/webhooks/*` in app.ts (NOT `/api/leads/*`), which has no `requireOrgSession` —
 * these are called by Facebook/Zalo's own servers, which can never hold a dashboard session.
 * The signature check below (HMAC-SHA256 for Facebook, plain SHA-256 for Zalo — different
 * schemes, see each verify function) is the only auth; there is no session to fall back on.
 *
 * Neither Facebook nor Zalo's webhook payload carries a tenant id, so each org's webhook URL
 * (configured once, in that org's FB App / Zalo OA console — BYOK, see
 * docs/features/leads/integrations.md §2.0, Donve itself never holds a Facebook/Zalo account)
 * embeds `orgId`/`campaignId` as query params — the signature covers the body, not the URL, so
 * this is safe as long as the resolved secret (per-org override, or the shared
 * `FACEBOOK_APP_SECRET`/`ZALO_OA_SECRET` fallback — see `resolveWebhookSecret`) stays private.
 */
export const leadsWebhooksRoutes = new Hono<AppEnv>();

/** Constant-time HMAC-SHA256 verification for Facebook's `X-Hub-Signature-256` (`header` is
 * expected to start with `"sha256="`). Zalo OA uses a different, non-HMAC scheme entirely —
 * see `verifyZaloSignature` below, not this function. */
export async function verifyHmacSignature(
  secret: string,
  rawBody: string,
  header: string | undefined,
  prefix: string
): Promise<boolean> {
  if (!secret || !header?.startsWith(prefix)) return false;
  const presented = header.slice(prefix.length);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(rawBody)
  );
  const expectedHex = [...new Uint8Array(mac)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return timingSafeEqual(expectedHex, presented);
}

/**
 * Zalo OA's `X-ZEvent-Signature` scheme — confirmed against Zalo's own community docs and a
 * third-party reference implementation (no primary-source page was fetchable, it's a JS-rendered
 * SPA; corroborated across 3 independent sources, see docs/features/leads/integrations.md §2).
 * It is genuinely NOT an HMAC despite the header name suggesting one: `mac = sha256(appId + data
 * + timestamp + OASecretKey)`, plain SHA-256 over that concatenation, where `appId`/`timestamp`
 * are pulled from fields INSIDE the JSON body itself (not headers), and `data` is the raw body
 * string exactly as received — re-serializing the parsed JSON before hashing produces a
 * different (wrong) signature, so this hashes `rawBody` directly, never `JSON.stringify(parsed)`.
 */
async function verifyZaloSignature(
  secret: string,
  rawBody: string,
  header: string | undefined
): Promise<boolean> {
  if (!secret || !header) return false;
  let body: { app_id?: unknown; timestamp?: unknown };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return false;
  }
  const timestamp = body.timestamp;
  if (
    typeof body.app_id !== "string" ||
    (typeof timestamp !== "string" && typeof timestamp !== "number")
  ) {
    return false;
  }

  const base = `${body.app_id}${rawBody}${timestamp}${secret}`;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(base)
  );
  const expectedHex = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return timingSafeEqual(expectedHex, header);
}

export interface MappedLead {
  fullName: string;
  phone: string;
  email: string | null;
  customFields: Record<string, unknown>;
}

const fieldDataItemSchema = z.object({
  name: z.string(),
  values: z.array(z.string())
});
type FieldDataItem = z.infer<typeof fieldDataItemSchema>;

/**
 * Meta's REAL Lead Ads webhook (`object: "page"`, field `leadgen`) does NOT carry the lead's
 * answers — it's a lightweight notification: `{leadgen_id, page_id, form_id, ...}`, nested under
 * `entry[].changes[].value`, and Meta batches multiple leads into one call (`entry`/`changes`
 * can each have more than one element). Fetching the actual `field_data` requires a SECOND,
 * separately authenticated call to the Graph API using a Page Access Token — see
 * `fetchFacebookFieldData` below and lead-integrations.md §1 for the full two-step flow and why
 * a bare webhook alone was never enough (this was wrong in an earlier version of this file: it
 * assumed `field_data` traveled inside the webhook body itself, which only real for hand-crafted
 * test payloads, never genuine Meta traffic).
 *
 * `value` also accepts `field_data` directly (a bare top-level `{field_data:[...]}` too) so
 * manual/test payloads that already resolved the data don't need a live Page Access Token.
 */
const facebookLeadValueSchema = z.union([
  z.object({ field_data: z.array(fieldDataItemSchema) }),
  z.object({ leadgen_id: z.string() })
]);

const facebookPayloadSchema = z.union([
  facebookLeadValueSchema,
  z.object({
    entry: z
      .array(
        z.object({
          changes: z.array(z.object({ value: facebookLeadValueSchema })).min(1)
        })
      )
      .min(1)
  })
]);

/** Flattens every `entry[].changes[].value` (or the bare single value) into one list — a real
 * Meta call can batch several leads into one webhook POST, and every one of them needs its own
 * `findOrCreateLead`, not just the first. */
function extractFacebookValues(
  payload: z.infer<typeof facebookPayloadSchema>
): z.infer<typeof facebookLeadValueSchema>[] {
  if ("entry" in payload) {
    return payload.entry.flatMap((entry) =>
      entry.changes.map((change) => change.value)
    );
  }
  return [payload];
}

/** The Graph API call Meta's own docs require for real Lead Ads traffic — the webhook only ever
 * hands you an id, never the answers. `pageAccessToken` is the org's own (BYOK, stored encrypted
 * alongside the App Secret) — Donve never holds a platform-wide Facebook token. */
async function fetchFacebookFieldData(
  leadgenId: string,
  pageAccessToken: string
): Promise<FieldDataItem[]> {
  const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(leadgenId)}?fields=field_data&access_token=${encodeURIComponent(pageAccessToken)}`;
  const res = await fetch(url);
  if (!res.ok) throw new ApiError(502, "facebook_graph_api_failed");
  const json: unknown = await res.json();
  const parsed = z
    .object({ field_data: z.array(fieldDataItemSchema).default([]) })
    .safeParse(json);
  if (!parsed.success) throw new ApiError(502, "facebook_graph_api_failed");
  return parsed.data.field_data;
}

/** Resolves one webhook value to its `field_data`, fetching from the Graph API when the webhook
 * only handed us a `leadgen_id` (the real Meta case) — 409s clearly if the org hasn't pasted a
 * Page Access Token yet, rather than silently dropping the lead. */
async function resolveFacebookFieldData(
  env: AppEnv["Bindings"],
  orgId: string,
  value: z.infer<typeof facebookLeadValueSchema>
): Promise<FieldDataItem[]> {
  if ("field_data" in value) return value.field_data;

  const db = createDbFromEnv(env);
  const credential = await webhookCredentialsRepository.findByOrgAndProvider(
    db,
    orgId,
    "facebook"
  );
  if (!credential?.encryptedPageAccessToken) {
    throw new ApiError(409, "facebook_page_access_token_not_configured");
  }
  const masterKey = await webhookMasterKey(env);
  const pageAccessToken = await decryptApiKey(
    credential.encryptedPageAccessToken,
    masterKey
  );
  return fetchFacebookFieldData(value.leadgen_id, pageAccessToken);
}

const KNOWN_NAME_FIELDS = new Set(["full_name", "name"]);
const KNOWN_PHONE_FIELDS = new Set(["phone_number", "phone"]);
const KNOWN_EMAIL_FIELDS = new Set(["email"]);

/** Maps Facebook's `field_data` array to the lead shape every ingestion path shares —
 * anything not in the known name/phone/email fields lands in `customFields`. */
function mapFacebookFieldData(fieldData: FieldDataItem[]): MappedLead {
  let fullName = "";
  let phone = "";
  let email: string | null = null;
  const customFields: Record<string, unknown> = {};

  for (const field of fieldData) {
    const value = field.values[0] ?? "";
    if (KNOWN_NAME_FIELDS.has(field.name)) fullName = value;
    else if (KNOWN_PHONE_FIELDS.has(field.name)) phone = value;
    else if (KNOWN_EMAIL_FIELDS.has(field.name)) email = value || null;
    else
      customFields[field.name] = field.values.length > 1 ? field.values : value;
  }
  return { fullName, phone, email, customFields };
}

/** Ingests one mapped lead through the same race-safe dedupe-by-phone upsert every other
 * source uses, then routes it — mirrors `POST /public/leads`'s created-vs-merged handling.
 * Exported so `apps/api/src/lib/webhook-delivery-sweep.ts` can re-run the exact same ingestion
 * for a captured dead-letter row, without re-verifying a signature that already passed once. */
export async function ingestWebhookLead(
  env: AppEnv["Bindings"],
  orgId: string,
  campaignId: string,
  source: LeadSource,
  mapped: MappedLead
): Promise<{ leadId: string; status: "created" | "merged" }> {
  const phone = normalizeVnPhone(mapped.phone);
  if (!mapped.fullName || !phone)
    throw new ApiError(400, "invalid_lead_payload");

  const db = createDbFromEnv(env);
  const campaign = await campaignsRepository.findById(db, orgId, campaignId);
  if (!campaign || campaign.deletedAt)
    throw new ApiError(404, "campaign_not_found");

  const { lead, merged } = await findOrCreateLead(
    db,
    {
      orgId,
      fullName: mapped.fullName,
      email: mapped.email,
      persona: null,
      customFields: mapped.customFields,
      utm: {}
    },
    campaign,
    phone,
    source
  );
  if (!merged) {
    await publishNewLeads(env, orgId, 1);
    await routeLead(db, orgId, lead);
    // NFR-09 / Nghị định 13/2023/NĐ-CP — same consent row every other ingestion path writes
    // (public form, CSV import). No end-user IP is available for a webhook call (Facebook/Zalo's
    // own servers call this, not the lead's browser), so `ip` is left null rather than recording
    // Facebook/Zalo's server IP as if it were the lead's — that would misrepresent the record.
    await consentsRepository.insert(db, orgId, {
      leadId: lead.id,
      consentType: "data_collection",
      policyVersion: CONSENT_POLICY_VERSION,
      ip: null
    });
  }
  return { leadId: lead.id, status: merged ? "merged" : "created" };
}

/**
 * Captures an unexpected (non-`ApiError`) `ingestWebhookLead` failure for the delivery-sweep
 * job to retry later. `ApiError`s (bad payload, unknown campaign) are permanent client errors
 * already surfaced with the right status — retrying them would just fail identically, so only
 * genuine 500s (a transient DB hiccup, `findOrCreateLead` throwing) get captured here; this is
 * additive, not a replacement for Facebook/Zalo/Zapier's own retry-on-5xx behavior.
 */
export async function captureIngestionFailure(
  env: AppEnv["Bindings"],
  orgId: string,
  campaignId: string,
  source: LeadSource,
  mapped: MappedLead,
  err: unknown
): Promise<void> {
  if (err instanceof ApiError) return;
  const db = createDbFromEnv(env);
  await webhookDeliveryFailuresRepository.insert(db, orgId, {
    campaignId,
    source: source as
      | "facebook"
      | "zalo_oa"
      | "generic"
      | "google_ads"
      | "tiktok",
    payload: mapped,
    lastError: err instanceof Error ? err.message : String(err)
  });
}

/** A malformed body is a client error (400), not a server error — matters for Facebook/Zalo's
 * own retry policy, and this is the one place both routes parse the body a second time (the
 * first parse happens inside signature verification, which already handles its own malformed-
 * JSON case by failing the signature check itself). */
function parseWebhookJson(rawBody: string): unknown {
  try {
    return JSON.parse(rawBody);
  } catch {
    throw new ApiError(400, "invalid_webhook_payload");
  }
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

/**
 * Meta's webhook-registration handshake: when you save the callback URL in the Facebook App
 * console, Meta sends `GET ?hub.mode=subscribe&hub.verify_token=X&hub.challenge=Y` and expects
 * the raw `hub.challenge` echoed back if the token matches. The token is per-org
 * (`webhookCredentials.verifyToken`, set via the settings UI) — `orgId` comes from the same
 * `?orgId=` query convention as the POST route below, since Meta's GET has no other way to
 * carry a tenant id. No org/credential/token match → 403 (never echo the challenge blindly).
 */
leadsWebhooksRoutes.get("/facebook-leads", async (c) => {
  const orgId = c.req.query("orgId");
  const mode = c.req.query("hub.mode");
  const token = c.req.query("hub.verify_token");
  const challenge = c.req.query("hub.challenge");
  if (!orgId || mode !== "subscribe" || !token || !challenge) {
    throw new ApiError(403, "invalid_verify_request");
  }

  const db = createDbFromEnv(c.env);
  const credential = await webhookCredentialsRepository.findByOrgAndProvider(
    db,
    orgId,
    "facebook"
  );
  if (
    !credential?.verifyToken ||
    !timingSafeEqual(credential.verifyToken, token)
  ) {
    throw new ApiError(403, "verify_token_mismatch");
  }
  return c.text(challenge);
});

leadsWebhooksRoutes.post("/facebook-leads", async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header("x-hub-signature-256");
  const { orgId, campaignId } = requireOrgAndCampaignQuery(c);
  const secret = await resolveWebhookSecret(c.env, orgId, "facebook");
  const verified = await verifyHmacSignature(
    secret,
    rawBody,
    signature,
    "sha256="
  );
  if (!verified) throw new ApiError(401, "invalid_webhook_signature");

  const parsed = facebookPayloadSchema.safeParse(parseWebhookJson(rawBody));
  if (!parsed.success) throw new ApiError(400, "invalid_webhook_payload");

  const values = extractFacebookValues(parsed.data);
  const [firstValue] = values;
  if (!firstValue) throw new ApiError(400, "invalid_webhook_payload");

  // The common case (a real Meta call almost always carries exactly one lead) keeps the
  // original behavior: real errors propagate as real HTTP status codes, matching
  // lead-integrations.md's documented curl test expectations. Only a genuinely batched call
  // (Meta CAN pack more than one lead into one webhook POST) switches to a per-item try/catch —
  // one bad lead in a 5-lead batch must not sink the other 4, so that path can't just throw.
  if (values.length === 1) {
    const fieldData = await resolveFacebookFieldData(c.env, orgId, firstValue);
    const mapped = mapFacebookFieldData(fieldData);
    try {
      const result = await ingestWebhookLead(
        c.env,
        orgId,
        campaignId,
        "facebook",
        mapped
      );
      return c.json({ ok: true, ...result });
    } catch (err) {
      await captureIngestionFailure(
        c.env,
        orgId,
        campaignId,
        "facebook",
        mapped,
        err
      );
      throw err;
    }
  }

  const results = await Promise.all(
    values.map(async (value) => {
      try {
        const fieldData = await resolveFacebookFieldData(c.env, orgId, value);
        const mapped = mapFacebookFieldData(fieldData);
        try {
          return await ingestWebhookLead(
            c.env,
            orgId,
            campaignId,
            "facebook",
            mapped
          );
        } catch (err) {
          await captureIngestionFailure(
            c.env,
            orgId,
            campaignId,
            "facebook",
            mapped,
            err
          );
          throw err;
        }
      } catch (err) {
        return { error: err instanceof ApiError ? err.code : "internal_error" };
      }
    })
  );
  return c.json({ ok: true, results });
});

/**
 * Real Zalo OA webhook shape for a user-sent-message event (`event_name: "user_send_text"` and
 * siblings) — `sender.id` is the user's Zalo id (opaque, scoped to this OA), NOT a phone number.
 * Zalo's OA platform does not expose a subscriber's phone number to the OA at all (privacy by
 * design — `getprofile` returns only name/avatar); a chat webhook alone can never carry
 * `{fullName, phone}` the way a landing-page form submit does. See
 * docs/features/leads/integrations.md §2 for why this endpoint is a best-effort fallback, not the
 * recommended integration path (a Zalo Mini App form → the existing `POST /public/leads`
 * endpoint is the one that can actually collect a phone number with the user's consent).
 *
 * Best-effort mapping used here: if the message text itself contains a Vietnamese phone number
 * (the common "nhắn SĐT để được tư vấn" chatbot pattern), treat it as a lead-intent signal and
 * create a lead from it. Anything else (images, stickers, a text with no phone number, every
 * other event type) is acknowledged with 200 and silently skipped — these are normal, frequent
 * chat events, not errors, and must never be treated as invalid webhook payloads.
 */
const zaloMessageEventSchema = z.object({
  app_id: z.string(),
  timestamp: z.union([z.string(), z.number()]),
  event_name: z.string().optional(),
  sender: z.object({ id: z.string() }).optional(),
  message: z.object({ text: z.string().optional() }).optional()
});

leadsWebhooksRoutes.post("/zalo-oa", async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header("x-zevent-signature");
  const { orgId, campaignId } = requireOrgAndCampaignQuery(c);
  const secret = await resolveWebhookSecret(c.env, orgId, "zalo_oa");
  const verified = await verifyZaloSignature(secret, rawBody, signature);
  if (!verified) throw new ApiError(401, "invalid_webhook_signature");

  const parsed = zaloMessageEventSchema.safeParse(parseWebhookJson(rawBody));
  if (!parsed.success) throw new ApiError(400, "invalid_webhook_payload");

  const text = parsed.data.message?.text ?? "";
  const phone = normalizeVnPhone(text);
  if (!phone) {
    // Not a phone-drop message (a sticker, "xin chào", a question, ...) — acknowledged, no lead.
    return c.json({ ok: true, status: "ignored" });
  }

  const zaloMapped: MappedLead = {
    fullName: `Zalo user ${parsed.data.sender?.id ?? "unknown"}`,
    phone: text,
    email: null,
    customFields: { zaloUserId: parsed.data.sender?.id ?? null }
  };
  try {
    const result = await ingestWebhookLead(
      c.env,
      orgId,
      campaignId,
      "zalo_oa",
      zaloMapped
    );
    return c.json({ ok: true, ...result });
  } catch (err) {
    await captureIngestionFailure(
      c.env,
      orgId,
      campaignId,
      "zalo_oa",
      zaloMapped,
      err
    );
    throw err;
  }
});

/**
 * No-code-friendly bridge target for anything that can't call `POST /public/leads` directly —
 * that endpoint requires a Turnstile token, which only a real browser widget can produce, so a
 * server-to-server forwarder (Zapier's "Custom Request" action, a Make/n8n scenario, a Zalo
 * Mini App's own backend after it decodes a phone number, a custom CRM) has no way to use it.
 * This route swaps Turnstile for a simple bearer API key the org generates once in Donve
 * (Cài đặt → Webhook nhận lead → "API tuỳ chỉnh") and pastes into whichever tool is calling —
 * copy-pasting one static header value is something every no-code tool supports, unlike
 * computing an HMAC signature. See lead-integrations.md §D.
 */
leadsWebhooksRoutes.post("/generic-leads", async (c) => {
  const { orgId, campaignId } = requireOrgAndCampaignQuery(c);
  const presented = c.req.header("authorization")?.replace(/^Bearer\s+/i, "");
  const apiKey = await resolveGeneratedApiKey(c.env, orgId, "generic");
  if (!apiKey || !presented || !timingSafeEqual(apiKey, presented)) {
    throw new ApiError(401, "invalid_webhook_signature");
  }
  // Usage tracking for the settings UI's "last used" display — fires on every authenticated
  // call regardless of what happens to the lead afterward, since "used" means "this key
  // authenticated a request", not "created a lead".
  await webhookCredentialsRepository.touchLastUsed(
    createDbFromEnv(c.env),
    orgId,
    "generic"
  );

  const rawBody = await c.req.text();
  const parsed = genericLeadPayloadSchema.safeParse(parseWebhookJson(rawBody));
  if (!parsed.success) throw new ApiError(400, "invalid_webhook_payload");

  const genericMapped: MappedLead = {
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    email: parsed.data.email ?? null,
    customFields: parsed.data.customFields
  };
  try {
    const result = await ingestWebhookLead(
      c.env,
      orgId,
      campaignId,
      "generic",
      genericMapped
    );
    return c.json({ ok: true, ...result });
  } catch (err) {
    await captureIngestionFailure(
      c.env,
      orgId,
      campaignId,
      "generic",
      genericMapped,
      err
    );
    throw err;
  }
});

/**
 * Google Ads Lead Form Extensions' own native webhook — confirmed against Google's official
 * implementation guide (developers.google.com/google-ads/webhook/docs/implementation,
 * lead-integrations.md §E). Unlike Facebook, the full answer set travels IN the POST body
 * already (no second Graph-API-style fetch needed), and unlike every other provider here, the
 * key is verified from a JSON FIELD (`google_key`) rather than a header or HMAC signature — the
 * org generates it in Donve (same Donve-generated-key model as `generic`) and pastes it into the
 * Lead Form asset's own webhook settings in the Google Ads UI; Google echoes it back on every
 * call for Donve to compare.
 *
 * `user_column_data[].column_id` is Google's fixed vocabulary for well-known fields (full
 * schema: https://developers.google.com/google-ads/webhook/docs/implementation) — anything
 * outside `KNOWN_*` below lands in `customFields`, same fallback as Facebook's `field_data`.
 * The response body is `{}` on success (not the `{ok:true,...}` shape every other route here
 * uses) because that is what Google's own doc table specifies for a 200 — Google's retry logic
 * is documented as status-code driven, but there is no reason to diverge from a documented
 * contract when the exact shape is known.
 */
const googleAdsColumnDataSchema = z.object({
  column_id: z.string(),
  string_value: z.string()
});

const googleAdsLeadPayloadSchema = z.object({
  lead_id: z.string(),
  google_key: z.string(),
  is_test: z.boolean().optional(),
  user_column_data: z.array(googleAdsColumnDataSchema).default([])
});

const GOOGLE_ADS_NAME_COLUMNS = new Set(["FULL_NAME"]);
const GOOGLE_ADS_PHONE_COLUMNS = new Set(["PHONE_NUMBER"]);
const GOOGLE_ADS_EMAIL_COLUMNS = new Set(["EMAIL"]);

function mapGoogleAdsColumnData(
  columns: z.infer<typeof googleAdsColumnDataSchema>[]
): MappedLead {
  let fullName = "";
  let phone = "";
  let email: string | null = null;
  const customFields: Record<string, unknown> = {};

  for (const column of columns) {
    if (GOOGLE_ADS_NAME_COLUMNS.has(column.column_id))
      fullName = column.string_value;
    else if (GOOGLE_ADS_PHONE_COLUMNS.has(column.column_id))
      phone = column.string_value;
    else if (GOOGLE_ADS_EMAIL_COLUMNS.has(column.column_id))
      email = column.string_value || null;
    else customFields[column.column_id] = column.string_value;
  }
  return { fullName, phone, email, customFields };
}

leadsWebhooksRoutes.post("/google-ads-leads", async (c) => {
  const { orgId, campaignId } = requireOrgAndCampaignQuery(c);
  const rawBody = await c.req.text();
  const parsed = googleAdsLeadPayloadSchema.safeParse(
    parseWebhookJson(rawBody)
  );
  if (!parsed.success) throw new ApiError(400, "invalid_webhook_payload");

  const apiKey = await resolveGeneratedApiKey(c.env, orgId, "google_ads");
  if (!apiKey || !timingSafeEqual(apiKey, parsed.data.google_key)) {
    throw new ApiError(401, "invalid_webhook_signature");
  }
  await webhookCredentialsRepository.touchLastUsed(
    createDbFromEnv(c.env),
    orgId,
    "google_ads"
  );

  // Google's own "Send test data" button (lead-integrations.md §E.4) sends a dummy lead_id/
  // gcl_id with `is_test: true` — acknowledged with the same 200/`{}` contract as a real lead,
  // but never actually ingested, so testing the connection never creates a fake lead in the CRM.
  if (parsed.data.is_test) return c.json({});

  const mapped = mapGoogleAdsColumnData(parsed.data.user_column_data);
  try {
    await ingestWebhookLead(c.env, orgId, campaignId, "google_ads", mapped);
    return c.json({});
  } catch (err) {
    await captureIngestionFailure(
      c.env,
      orgId,
      campaignId,
      "google_ads",
      mapped,
      err
    );
    throw err;
  }
});
