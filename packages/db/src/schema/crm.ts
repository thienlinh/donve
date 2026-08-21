import { sql } from "drizzle-orm";
import {
  index,
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
