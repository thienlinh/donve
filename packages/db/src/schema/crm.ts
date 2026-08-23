import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

import { deletedAt, id, timestamps } from "./columns.js";
import { orgIsolationPolicy, platformReadPolicy } from "./rls.js";

export const leads = pgTable(
  "leads",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    campaignId: text("campaign_id").notNull(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    persona: text("persona"),
    customFields: jsonb("custom_fields").default({}),
    utm: jsonb("utm").default({}),
    stage: text("stage").notNull().default("new"),
    assigneeId: text("assignee_id"),
    // multi-source ingestion — every insert path (public submit form, CSV import, the
    // Facebook/Zalo OA webhooks) sets this explicitly rather than relying on the default.
    source: text("source", {
      enum: [
        "landing_page",
        "facebook",
        "zalo_oa",
        "manual",
        "csv_import",
        // Generic API-key webhook (`/webhooks/generic-leads`) — the bridge target for any
        // server-to-server forwarder (a custom CRM, a Zalo Mini App's own decode backend) that
        // can't produce a Turnstile token, lead-integrations.md §D.
        "generic",
        // Google Ads Lead Form Extensions native webhook (`/webhooks/google-ads-leads`),
        // lead-integrations.md §D.
        "google_ads",
        // TikTok Lead Generation (Instant Form) via the OAuth-connected Subscription API
        // webhook (`/webhooks/tiktok-leads`), lead-integrations.md §D.
        "tiktok"
      ]
    })
      .notNull()
      .default("manual"),
    // dashboard "unread" indicator — set by `PATCH /:id/viewed`, never inferred elsewhere.
    lastViewedAt: timestamp("last_viewed_at"),
    ...timestamps,
    deletedAt: deletedAt(),
    // NFR-10/NFR-11 (Nghị định 13/2023/NĐ-CP) — set once phone/email/customFields are
    // scrubbed, by request or by the retention job. Row (and its orders/payments) stays.
    anonymizedAt: timestamp("anonymized_at")
  },
  (t) => [
    uniqueIndex("uq_lead_phone")
      .on(t.orgId, t.phone)
      .where(sql`deleted_at IS NULL`),
    index("ix_leads_list").on(t.orgId, t.campaignId, t.stage, t.createdAt),
    index("ix_leads_assignee").on(t.orgId, t.assigneeId),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

/**
 * Auto-assignment/routing engine (module E follow-up) — ordered rule set per org, evaluated
 * top-to-bottom by `priority` in `routeLead` (apps/api/src/modules/leads/routing.ts). SLA
 * columns are stored now for the dashboard's rule editor but the breach-sweep job itself is a
 * later phase — nothing reads `slaHours`/`onSlaBreach` yet.
 */
export const assignmentRules = pgTable(
  "assignment_rules",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    priority: integer("priority").notNull().default(0),
    /** null matches any campaign. */
    matchCampaignId: text("match_campaign_id"),
    /** null matches any persona. */
    matchPersona: text("match_persona"),
    strategy: text("strategy", {
      enum: ["round_robin", "least_active_leads", "fixed_assignee"]
    }).notNull(),
    assigneePoolIds: jsonb("assignee_pool_ids").$type<string[]>().default([]),
    fixedAssigneeId: text("fixed_assignee_id"),
    /** round-robin cursor — the pool index assigned last, persisted so the rotation survives restarts. */
    lastAssignedIndex: integer("last_assigned_index").notNull().default(0),
    slaHours: integer("sla_hours"),
    onSlaBreach: text("on_sla_breach", {
      enum: ["reassign_next_in_pool", "notify_manager"]
    }),
    ...timestamps,
    deletedAt: deletedAt()
  },
  (t) => [
    index("ix_assignment_rules_org").on(t.orgId, t.priority),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

/** Saved lead-list filter presets. `userId` is always the creator (contract's `ownerId`);
 * `shared` (admin/owner-only to set) is a separate visibility flag rather than nulling
 * `userId`, so a shared view still remembers who made it. */
export const savedViews = pgTable(
  "saved_views",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    filterJson: jsonb("filter_json").notNull().default({}),
    shared: boolean("shared").notNull().default(false),
    createdAt: timestamps.createdAt
  },
  (t) => [
    index("ix_saved_views_org").on(t.orgId),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

/** Per-org override of the webhook HMAC secret/verify-token used by
 * `apps/api/src/modules/leads/webhooks.ts` (Facebook Lead Ads / Zalo OA ingestion). An org with
 * no row here falls back to the shared `FACEBOOK_APP_SECRET`/`ZALO_OA_SECRET` env vars (the
 * "one central app" deployment model) — a row here is what lets an org that connected its own
 * Facebook App/Zalo OA properly isolate itself, closing the cross-org forgery gap where the
 * signature only ever covered the request body, never the `orgId` query param that picks the
 * tenant. `encryptedSecret` is AES-256-GCM via `@dv/ai-gateway`'s key-vault (see
 * `WEBHOOK_KEY_MASTER_SECRET`); `verifyToken` is plaintext since Meta's GET handshake token
 * isn't sensitive by design, it only needs to match.
 *
 * `provider: "generic"`/`"google_ads"` are a different shape entirely — Donve GENERATES
 * `encryptedSecret` (the org never pastes an externally-obtained one) and shows the plaintext
 * exactly once at creation. `generic` backs `/webhooks/generic-leads` (lead-integrations.md §D),
 * the no-code-friendly bridge target for any server-to-server forwarder (e.g. a Zalo Mini App's
 * own backend) that can't produce a Turnstile token the way a real browser can, so it can't use
 * `POST /public/leads` directly. `google_ads` backs `/webhooks/google-ads-leads` — Google's own
 * Lead Form webhook contract has the org paste a Donve-generated key INTO the Google Ads UI
 * (Google echoes it back as `google_key` in every POST body for Donve to compare), the inverse
 * direction of Facebook/Zalo's org-pasted-external-secret model but the same generated-key shape
 * as `generic`. */
export const webhookCredentials = pgTable(
  "webhook_credentials",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    provider: text("provider", {
      enum: ["facebook", "zalo_oa", "generic", "google_ads"]
    }).notNull(),
    encryptedSecret: text("encrypted_secret").notNull(),
    verifyToken: text("verify_token"),
    // Facebook only — a real Meta Lead Ads webhook carries only a `leadgen_id`, never the
    // actual form answers; fetching `field_data` requires a second, authenticated Graph API
    // call with a Page Access Token (lead-integrations.md §1). Zalo needs no equivalent since
    // its message-event webhook already carries everything this route uses.
    encryptedPageAccessToken: text("encrypted_page_access_token"),
    // Set on every successful auth check against this credential (webhooks.ts's
    // `touchLastUsed` calls) — lets an org confirm a generated `generic` API key is actually
    // being called by whatever tool it was pasted into, instead of waiting to see a lead show
    // up. Only wired for `generic` today (lead-integrations.md's documented gap); facebook/
    // zalo_oa could reuse the same column later without a schema change.
    lastUsedAt: timestamp("last_used_at"),
    ...timestamps
  },
  (t) => [
    uniqueIndex("uq_webhook_credentials_org_provider").on(t.orgId, t.provider),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

/**
 * BYOK credentials for the `notify_manager` SLA-breach push (packages/drivers/src/notify) —
 * same shape/reasoning as `webhookCredentials`: the org registers its OWN Zalo ZNS app / eSMS
 * account, Donve never holds a platform-wide one. `encryptedSecret` is the whole provider-
 * specific secret bundle serialized as one JSON string before encryption (Zalo ZNS:
 * `{accessToken, appId, secretKey}`; eSMS: `{apiKey, secretKey}`) rather than one column per
 * possible field — providers don't share a secret shape, and a single encrypted blob avoids a
 * column explosion for fields only one provider ever uses. `config` holds the NON-secret,
 * provider-specific fields an org enters alongside the secret (Zalo ZNS: `templateId`; eSMS:
 * `brandname`) — safe to read back verbatim in the settings UI, unlike `encryptedSecret`.
 * Which channel is actually active is `organizations.settings.notifyChannel`
 * (packages/contracts/src/tenancy.ts), not a column here — a row existing here only means
 * "configured", not "selected".
 */
export const notifyCredentials = pgTable(
  "notify_credentials",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    provider: text("provider", {
      enum: ["zalo_zns", "esms"]
    }).notNull(),
    encryptedSecret: text("encrypted_secret").notNull(),
    config: jsonb("config").$type<Record<string, string>>().default({}),
    ...timestamps
  },
  (t) => [
    uniqueIndex("uq_notify_credentials_org_provider").on(t.orgId, t.provider),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

export const leadActivities = pgTable(
  "lead_activities",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    leadId: text("lead_id").notNull(),
    type: text("type", {
      enum: [
        "note",
        "call",
        "stage_change",
        "order_created",
        "payment",
        "resubmit",
        "system"
      ]
    }).notNull(),
    body: text("body"),
    meta: jsonb("meta").default({}),
    actorId: text("actor_id"),
    createdAt: timestamps.createdAt
  },
  (t) => [index("ix_act_lead").on(t.leadId, t.createdAt)]
);

// Nghị định 13/2023/NĐ-CP (personal data protection) — keeps a record of collection consent
export const consents = pgTable(
  "consents",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    leadId: text("lead_id").notNull(),
    consentType: text("consent_type").notNull().default("data_collection"),
    policyVersion: text("policy_version").notNull(),
    ip: text("ip"),
    createdAt: timestamps.createdAt
  },
  (t) => [
    index("ix_consent_lead").on(t.leadId),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

export const orders = pgTable(
  "orders",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    code: text("code").notNull(),
    leadId: text("lead_id").notNull(),
    campaignId: text("campaign_id").notNull(),
    productId: text("product_id"),
    amount: numeric("amount", { precision: 12, scale: 0 }).notNull(),
    status: text("status", {
      enum: [
        "pending",
        "awaiting_confirmation",
        "paid",
        "fulfilled",
        "cancelled",
        "refunded"
      ]
    })
      .notNull()
      .default("pending"),
    paidAt: timestamp("paid_at"),
    fulfilledAt: timestamp("fulfilled_at"),
    expiresAt: timestamp("expires_at"),
    ...timestamps
  },
  (t) => [
    uniqueIndex("uq_order_code").on(t.orgId, t.code),
    index("ix_orders_status").on(t.orgId, t.status, t.createdAt),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

export const payments = pgTable(
  "payments",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    orderId: text("order_id"),
    provider: text("provider").notNull().default("sepay"),
    providerTxId: text("provider_tx_id").notNull(),
    amount: numeric("amount", { precision: 12, scale: 0 }).notNull(),
    rawPayload: jsonb("raw_payload").notNull(),
    matchType: text("match_type", { enum: ["auto", "fuzzy", "manual"] }),
    createdAt: timestamps.createdAt
  },
  // idempotency
  (t) => [
    uniqueIndex("uq_payment_tx").on(t.provider, t.providerTxId),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

// non-custodial model: each org connects its own payment provider, the platform never holds funds
export const paymentConnections = pgTable(
  "payment_connections",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    provider: text("provider").notNull().default("sepay"),
    // webhook auth secret, AES-256-GCM like ai_connections.encryptedKey
    encryptedApiKey: text("encrypted_api_key").notNull(),
    bankBin: text("bank_bin").notNull(),
    accountNumber: text("account_number").notNull(),
    accountName: text("account_name").notNull(),
    status: text("status", { enum: ["active", "invalid"] })
      .notNull()
      .default("active"),
    createdAt: timestamps.createdAt
  },
  (t) => [
    uniqueIndex("uq_payment_conn_org").on(t.orgId, t.provider),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

export const unmatchedTransactions = pgTable(
  "unmatched_transactions",
  {
    id: id(),
    // always resolvable to an org via the per-org webhook secret — NOT nullable
    orgId: text("org_id").notNull(),
    providerTxId: text("provider_tx_id").notNull(),
    rawPayload: jsonb("raw_payload").notNull(),
    reason: text("reason", {
      enum: ["no_candidate", "ambiguous", "already_paid"]
    }).notNull(),
    // used when reason=ambiguous, ranked by match confidence at the app layer
    candidateOrderIds: jsonb("candidate_order_ids").default([]),
    status: text("status", { enum: ["pending", "resolved"] })
      .notNull()
      .default("pending"),
    resolvedOrderId: text("resolved_order_id"),
    resolvedBy: text("resolved_by"),
    resolvedAt: timestamp("resolved_at"),
    createdAt: timestamps.createdAt
  },
  (t) => [
    index("ix_unmatched_org").on(t.orgId, t.status),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

// NFR-10 (Nghị định 13/2023/NĐ-CP) — logs a lead's delete/export request so the org (the data
// controller, NFR-12) can track its own 72h response SLA. No in-app intake; staff logs a
// request that arrived by phone/email/etc, backdating `receivedAt` if it wasn't logged the
// moment it came in.
export const dataSubjectRequests = pgTable(
  "data_subject_requests",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    leadId: text("lead_id").notNull(),
    requestType: text("request_type", { enum: ["delete", "export"] }).notNull(),
    receivedAt: timestamp("received_at").notNull().defaultNow(),
    // computed as receivedAt + 72h at write time, not re-derived on every read.
    dueAt: timestamp("due_at").notNull(),
    status: text("status", { enum: ["pending", "completed"] })
      .notNull()
      .default("pending"),
    resolvedAt: timestamp("resolved_at"),
    notes: text("notes"),
    createdAt: timestamps.createdAt
  },
  (t) => [
    index("ix_dsr_org").on(t.orgId, t.status, t.dueAt),
    index("ix_dsr_lead").on(t.leadId, t.createdAt),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

// manual refund flow — the platform never holds funds, ops must transfer the refund themselves
export const refundRequests = pgTable(
  "refund_requests",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    orderId: text("order_id").notNull(),
    paymentId: text("payment_id"),
    reason: text("reason", {
      enum: ["customer_request", "duplicate_payment", "wrong_match", "other"]
    }).notNull(),
    amount: numeric("amount", { precision: 12, scale: 0 }).notNull(),
    // pulled from payments.rawPayload when SePay reports the remitter's name/account
    remitterInfo: jsonb("remitter_info").default({}),
    status: text("status", {
      enum: ["pending", "processing", "completed", "rejected"]
    })
      .notNull()
      .default("pending"),
    evidenceKey: text("evidence_key"),
    createdBy: text("created_by"),
    createdAt: timestamps.createdAt,
    completedAt: timestamp("completed_at")
  },
  (t) => [
    index("ix_refund_org").on(t.orgId, t.status),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

/**
 * Retry/dead-letter for webhook lead ingestion (lead-integrations.md's documented gap: "Không
 * có retry/dead-letter nếu ingestWebhookLead lỗi 500"). Only genuinely unexpected failures land
 * here — `ingestWebhookLead` throwing `ApiError` (bad payload, unknown campaign) is a permanent
 * client error already surfaced as the right HTTP status, retrying it would just fail the same
 * way again. `payload` is the already-mapped `{fullName, phone, email, customFields}` shape
 * `ingestWebhookLead` takes, captured post-signature-verification — the sweep in
 * apps/api/src/lib/webhook-delivery-sweep.ts re-runs `ingestWebhookLead` itself, not the raw
 * webhook body, so it never re-verifies a signature that already passed once.
 */
export const webhookDeliveryFailures = pgTable(
  "webhook_delivery_failures",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    campaignId: text("campaign_id").notNull(),
    source: text("source", {
      enum: ["facebook", "zalo_oa", "generic", "google_ads", "tiktok"]
    }).notNull(),
    payload: jsonb("payload").notNull(),
    status: text("status", {
      enum: ["pending", "dead_letter", "resolved"]
    })
      .notNull()
      .default("pending"),
    attempts: integer("attempts").notNull().default(0),
    lastError: text("last_error"),
    createdAt: timestamps.createdAt,
    lastAttemptAt: timestamp("last_attempt_at"),
    resolvedAt: timestamp("resolved_at")
  },
  (t) => [
    index("ix_webhook_delivery_failures_status").on(t.status, t.createdAt),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

/**
 * One row per org that connected a TikTok Ads account via the OAuth flow (lead-integrations.md
 * §D) — "Kết nối TikTok Ads" in Settings. Unlike `webhookCredentials`, there is no external
 * secret an org pastes: `encryptedAccessToken` comes back from TikTok's OAuth token exchange
 * (`/oauth2/access_token/`) using Donve's own shared `TIKTOK_APP_ID`/`TIKTOK_APP_SECRET`, and per
 * TikTok's docs this is a long-term token with no `expires_in`/`refresh_token` in the response —
 * so unlike a typical OAuth integration, there's deliberately no refresh-token column or sweep
 * job here; add one only if TikTok's contract changes.
 *
 * `subscriptionId` is TikTok's own id for the `LEAD` webhook subscription created right after
 * connecting (`POST /subscription/subscribe/`) — needed to unsubscribe cleanly when the org
 * disconnects, otherwise TikTok keeps POSTing to a callback URL nobody is listening for anymore.
 * One row per `(orgId, campaignId)` since each campaign needs its own subscription to route
 * leads to the right `campaignId` (same reasoning as Facebook/Zalo/Google's `&campaignId=` query
 * param — TikTok's webhook payload carries `advertiser_id`/`page_id`, never a Donve campaign id).
 */
export const tiktokConnections = pgTable(
  "tiktok_connections",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    campaignId: text("campaign_id").notNull(),
    advertiserId: text("advertiser_id").notNull(),
    pageId: text("page_id"),
    encryptedAccessToken: text("encrypted_access_token").notNull(),
    subscriptionId: text("subscription_id").notNull(),
    ...timestamps
  },
  (t) => [
    uniqueIndex("uq_tiktok_connections_org_campaign").on(t.orgId, t.campaignId),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();
