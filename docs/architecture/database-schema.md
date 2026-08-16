# 04 — Database Schema (Neon Postgres + Drizzle ORM)

Quy ước: PK = ULID (`text`, sortable theo thời gian); mọi bảng nghiệp vụ có `org_id`, `created_at`, `updated_at`; soft-delete (`deleted_at`) cho leads/landing/campaigns; JSONB cho phần extensible. Dưới đây là schema Drizzle rút gọn cột chính (đủ để code thẳng).

```ts
// packages/db/src/schema/core.ts
import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  numeric,
  uniqueIndex,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ===== Tenancy & Auth (Better Auth quản user/session/account; ta thêm phần org) =====
export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // dùng cho subdomain mặc định
  plan: text("plan").notNull().default("free"), // free|starter|pro
  aiCreditBalance: integer("ai_credit_balance").notNull().default(0),
  settings: jsonb("settings").notNull().default({}), // brand tokens, pipeline stages, timezone
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const memberships = pgTable(
  "memberships",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id),
    userId: text("user_id").notNull(), // ref better-auth users
    role: text("role", {
      enum: ["owner", "admin", "editor", "sales"],
    }).notNull(),
    salesConfig: jsonb("sales_config").default({}), // { seeAllLeads: false }
  },
  (t) => [uniqueIndex("uq_membership").on(t.orgId, t.userId)]
);

export const invites = pgTable("invites", {
  /* orgId, email, role, token, expiresAt */
});

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    actorId: text("actor_id"),
    action: text("action").notNull(), // "order.mark_paid", "landing.publish"...
    targetType: text("target_type"),
    targetId: text("target_id"),
    meta: jsonb("meta").default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("ix_audit_org_time").on(t.orgId, t.createdAt)]
);
```

```ts
// ===== Catalog: products / courses / campaigns =====
export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    type: text("type", {
      enum: ["course", "product", "service", "other"],
    }).notNull(),
    name: text("name").notNull(),
    price: numeric("price", { precision: 12, scale: 0 }).notNull().default("0"), // VND
    description: text("description"),
    images: jsonb("images").default([]),
    attributes: jsonb("attributes").default({}), // course: { zaloGroupUrl, activationGuide, startDate }
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("ix_products_org").on(t.orgId, t.type)]
);

export const campaigns = pgTable(
  "campaigns",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    publicId: text("public_id").notNull(), // dùng ở landing runtime, không lộ ULID nội bộ
    name: text("name").notNull(),
    status: text("status", { enum: ["draft", "active", "paused", "ended"] })
      .notNull()
      .default("draft"),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    formConfig: jsonb("form_config").notNull().default({}),
    /* formConfig: { fields:[{key:"full_name",required:true},{key:"phone"},{key:"email",required:false},
       {key:"persona",type:"select",label:"Bạn đang là ai?",options:[...]}, ...custom],
     popups:{ registered:{title,body}, paid:{title,body}, manualPending:{title,body} } } */
    paymentConfig: jsonb("payment_config").notNull().default({}),
    /* { enabled, bankBin, accountNumber, accountName, amountSource:"product|fixed", fixedAmount,
       transferPrefix:"DV", sepayAuto:true, zaloGroupUrl, expireMinutes:1440 } */
    utmDefaults: jsonb("utm_defaults").default({}),
    ...timestamps,
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [
    uniqueIndex("uq_campaign_public_id")
      .on(t.publicId)
      .where(sql`deleted_at IS NULL`),
  ]
);

export const campaignProducts = pgTable(
  "campaign_products",
  {
    campaignId: text("campaign_id").notNull(),
    productId: text("product_id").notNull(),
    orgId: text("org_id").notNull(),
  },
  (t) => [uniqueIndex("uq_cp").on(t.campaignId, t.productId)]
);
```

```ts
// ===== Studio: landing pages, versions, assets, comments =====
export const landingPages = pgTable(
  "landing_pages",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    campaignId: text("campaign_id"), // nullable: có thể tạo trước, gắn sau
    name: text("name").notNull(),
    currentVersionId: text("current_version_id"),
    thumbnailKey: text("thumbnail_key"), // R2 key
    chatSessionId: text("chat_session_id"),
    source: text("source", { enum: ["ai", "import"] })
      .notNull()
      .default("ai"),
    ...timestamps,
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("ix_lp_org").on(t.orgId, t.campaignId)]
);

export const pageVersions = pgTable(
  "page_versions",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    landingPageId: text("landing_page_id").notNull(),
    seq: integer("seq").notNull(), // tăng dần per page
    htmlKey: text("html_key").notNull(), // R2: pages/<pageId>/v<seq>.html
    srcmapKey: text("srcmap_key").notNull(),
    origin: text("origin", {
      enum: ["ai_patch", "ai_full", "manual", "import", "restore"],
    }).notNull(),
    patch: jsonb("patch"), // ops đã áp (audit/diff)
    chatMessageId: text("chat_message_id"), // liên kết ngược tới message AI đã sinh version này (nullable — manual/import/restore không có)
    label: text("label"),
    createdBy: text("created_by"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    prunedAt: timestamp("pruned_at"), // set khi job retention xoá htmlKey/srcmapKey khỏi R2 (infra-deployment-cost.md §2) — row Postgres vẫn giữ cho lịch sử/audit
  },
  (t) => [uniqueIndex("uq_pv").on(t.landingPageId, t.seq)]
);

export const pageAssets = pgTable("page_assets", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  landingPageId: text("landing_page_id").notNull(),
  fileName: text("file_name").notNull(),
  r2Key: text("r2_key").notNull(),
  mime: text("mime").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  variants: jsonb("variants").default({}), // webp/avif/resized keys
  source: text("source", {
    enum: ["user_upload", "stock_licensed", "ai_generated"],
  })
    .notNull()
    .default("user_upload"),
  license: jsonb("license").default({}), // { provider, attribution, sourceUrl } — bắt buộc khi source=stock_licensed
  unverifiedSource: boolean("unverified_source").notNull().default(false), // true khi import HTML kéo ảnh URL ngoài không rõ nguồn
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const studioComments = pgTable("studio_comments", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  landingPageId: text("landing_page_id").notNull(),
  srcmapId: text("srcmap_id").notNull(), // "cc-2"
  body: text("body").notNull(),
  screenshotKey: text("screenshot_key"),
  status: text("status", { enum: ["queued", "sent", "resolved"] })
    .notNull()
    .default("queued"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  /* orgId, landingPageId, title */
});
export const chatMessages = pgTable(
  "chat_messages",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    sessionId: text("session_id").notNull(),
    role: text("role", { enum: ["user", "assistant", "tool"] }).notNull(),
    content: jsonb("content").notNull(), // parts: text/image/comment-context/patch-summary
    tokenUsage: jsonb("token_usage"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("ix_msg_session").on(t.sessionId, t.createdAt)]
);
```

```ts
// ===== Publishing =====
export const deployments = pgTable(
  "deployments",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    landingPageId: text("landing_page_id").notNull(),
    pageVersionId: text("page_version_id").notNull(),
    hostname: text("hostname").notNull(), // yoga-6-tuan.donve.vn
    status: text("status", {
      enum: ["building", "live", "superseded", "failed", "unpublished"],
    }).notNull(),
    r2Prefix: text("r2_prefix").notNull(),
    meta: jsonb("meta").default({}), // lighthouse score, size
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("ix_deploy_host").on(t.hostname, t.status),
    uniqueIndex("uq_deploy_live_host")
      .on(t.hostname)
      .where(sql`status = 'live'`), // chỉ 1 bản ghi "live" mỗi hostname
  ]
);

export const customDomains = pgTable("custom_domains", {
  /* orgId, hostname, status, cfHostnameId */
});

export const publishOutbox = pgTable(
  "publish_outbox",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    deploymentId: text("deployment_id").notNull(),
    hostname: text("hostname").notNull(),
    targetDeployId: text("target_deploy_id").notNull(), // deployment sẽ trỏ tới sau khi áp dụng (publish hoặc rollback)
    status: text("status", { enum: ["pending", "applied", "failed"] })
      .notNull()
      .default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    appliedAt: timestamp("applied_at"),
  },
  (t) => [index("ix_outbox_status").on(t.status, t.createdAt)]
);
```

```ts
// ===== CRM: leads / orders / payments =====
export const leads = pgTable(
  "leads",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    campaignId: text("campaign_id").notNull(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(), // normalize +84
    email: text("email"),
    persona: text("persona"), // "Bạn đang là ai?"
    customFields: jsonb("custom_fields").default({}),
    utm: jsonb("utm").default({}),
    stage: text("stage").notNull().default("new"), // theo pipeline org settings
    assigneeId: text("assignee_id"),
    ...timestamps,
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [
    uniqueIndex("uq_lead_phone")
      .on(t.orgId, t.phone)
      .where(sql`deleted_at IS NULL`), // dedupe FR-E-06
    index("ix_leads_list").on(t.orgId, t.campaignId, t.stage, t.createdAt),
    index("ix_leads_assignee").on(t.orgId, t.assigneeId),
  ]
);

export const leadActivities = pgTable(
  "lead_activities",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    leadId: text("lead_id").notNull(),
    type: text("type").notNull(), // note|call|stage_change|order_created|payment|resubmit|system
    body: text("body"),
    meta: jsonb("meta").default({}),
    actorId: text("actor_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("ix_act_lead").on(t.leadId, t.createdAt)]
);

// tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân — lưu vết đồng ý thu thập dữ liệu
export const consents = pgTable(
  "consents",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    leadId: text("lead_id").notNull(),
    consentType: text("consent_type").notNull().default("data_collection"),
    policyVersion: text("policy_version").notNull(),
    ip: text("ip"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("ix_consent_lead").on(t.leadId)]
);

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    code: text("code").notNull(), // "DV4F7K" — nội dung CK
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
        "refunded",
      ],
    })
      .notNull()
      .default("pending"),
    paidAt: timestamp("paid_at"),
    fulfilledAt: timestamp("fulfilled_at"),
    expiresAt: timestamp("expires_at"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("uq_order_code").on(t.orgId, t.code),
    index("ix_orders_status").on(t.orgId, t.status, t.createdAt),
  ]
);

export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    orderId: text("order_id"),
    provider: text("provider").notNull().default("sepay"),
    providerTxId: text("provider_tx_id").notNull(),
    amount: numeric("amount", { precision: 12, scale: 0 }).notNull(),
    rawPayload: jsonb("raw_payload").notNull(),
    matchType: text("match_type", { enum: ["auto", "fuzzy", "manual"] }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("uq_payment_tx").on(t.provider, t.providerTxId)]
); // idempotency

// mô hình non-custodial: mỗi org tự kết nối provider thanh toán của họ, nền tảng không giữ tiền hộ.
// provider: "sepay" (driver mặc định v1) | "vnpay" | "momo" | "casso" | "payos" — xem FR-D-10
export const paymentConnections = pgTable(
  "payment_connections",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    provider: text("provider").notNull().default("sepay"),
    encryptedApiKey: text("encrypted_api_key").notNull(), // webhook auth secret, AES-256-GCM giống ai_connections.encryptedKey
    bankBin: text("bank_bin").notNull(),
    accountNumber: text("account_number").notNull(),
    accountName: text("account_name").notNull(),
    status: text("status", { enum: ["active", "invalid"] })
      .notNull()
      .default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("uq_payment_conn_org").on(t.orgId, t.provider)]
);

export const unmatchedTransactions = pgTable(
  "unmatched_transactions",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(), // luôn xác định được org qua webhook secret per-org — KHÔNG nullable
    providerTxId: text("provider_tx_id").notNull(),
    rawPayload: jsonb("raw_payload").notNull(),
    reason: text("reason", {
      enum: ["no_candidate", "ambiguous", "already_paid"],
    }).notNull(),
    candidateOrderIds: jsonb("candidate_order_ids").default([]), // dùng khi reason=ambiguous, xếp hạng độ khớp ở tầng app
    status: text("status", { enum: ["pending", "resolved"] })
      .notNull()
      .default("pending"),
    resolvedOrderId: text("resolved_order_id"),
    resolvedBy: text("resolved_by"),
    resolvedAt: timestamp("resolved_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("ix_unmatched_org").on(t.orgId, t.status)]
);

// flow hoàn tiền thủ công — nền tảng không giữ tiền, ops phải tự chuyển khoản hoàn trả
export const refundRequests = pgTable(
  "refund_requests",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    orderId: text("order_id").notNull(),
    paymentId: text("payment_id"),
    reason: text("reason", {
      enum: ["customer_request", "duplicate_payment", "wrong_match", "other"],
    }).notNull(),
    amount: numeric("amount", { precision: 12, scale: 0 }).notNull(),
    remitterInfo: jsonb("remitter_info").default({}), // trích từ payments.rawPayload nếu SePay trả tên/tài khoản người chuyển
    status: text("status", {
      enum: ["pending", "processing", "completed", "rejected"],
    })
      .notNull()
      .default("pending"),
    evidenceKey: text("evidence_key"), // R2 key ảnh chứng từ hoàn tiền, tuỳ chọn
    createdBy: text("created_by"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
  },
  (t) => [index("ix_refund_org").on(t.orgId, t.status)]
);
```

```ts
// ===== AI: connections / prompts / skills / usage =====
export const aiConnections = pgTable("ai_connections", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  provider: text("provider", {
    enum: ["anthropic", "openai", "openrouter", "platform"],
  }).notNull(),
  encryptedKey: text("encrypted_key"), // null nếu provider=platform
  keyLast4: text("key_last4"),
  defaultModel: text("default_model").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  status: text("status", { enum: ["active", "invalid"] })
    .notNull()
    .default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aiUsage = pgTable(
  "ai_usage",
  {
    // đo token, trừ credit
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    connectionId: text("connection_id").notNull(),
    model: text("model").notNull(),
    inputTokens: integer("input_tokens").notNull(),
    outputTokens: integer("output_tokens").notNull(),
    creditCost: integer("credit_cost").notNull().default(0),
    context: jsonb("context").default({}), // pageId, sessionId
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("ix_usage_org_time").on(t.orgId, t.createdAt)]
);

export const skills = pgTable(
  "skills",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id"), // null = platform skill (read-only tenant)
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    content: text("content").notNull(), // markdown
    version: integer("version").notNull().default(1),
    isActiveDefault: boolean("is_active_default").notNull().default(false),
    ...timestamps,
  },
  (t) => [uniqueIndex("uq_skill").on(t.orgId, t.slug)]
);

export const promptTemplates = pgTable("prompt_templates", {
  /* orgId?, slug, sections jsonb, variables, version */
});
export const landingSkills = pgTable("landing_skills", {
  /* landingPageId, skillId — skill bật per page */
});

// ===== Email giao dịch (Resend) =====
export const emailLogs = pgTable(
  "email_logs",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id"), // null cho email trước khi có org (verify signup)
    to: text("to").notNull(),
    template: text("template").notNull(), // "verify_email"|"invite"|"lead_digest"|"order_paid"...
    resendId: text("resend_id"), // id trả về từ Resend, tra cứu bounce/delivery
    status: text("status", {
      enum: ["queued", "sent", "delivered", "bounced", "failed"],
    })
      .notNull()
      .default("queued"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("ix_email_org_time").on(t.orgId, t.createdAt)]
);
```

```ts
// ===== Analytics (append-only, ghi từ edge beacon) =====
export const events = pgTable(
  "events",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    campaignId: text("campaign_id"),
    deploymentId: text("deployment_id"),
    type: text("type").notNull(), // view|submit|order_created|paid_popup|zalo_click
    sessionHash: text("session_hash"), // hash(ip+ua+ngày) — không PII
    meta: jsonb("meta").default({}), // utm, referrer
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("ix_events").on(t.orgId, t.campaignId, t.type, t.createdAt)]
);
```

## Ghi chú thiết kế

0. **Full-text/fuzzy search** (`leads.fullName`/`phone`/`email` — FR-E-01): bật extension `pg_trgm` + GIN index (`gin_trgm_ops`) trên các cột này thay vì kéo thêm search engine (Meilisearch/Typesense) — quy mô tenant/lead ở v1 không cần search engine riêng, Postgres native đã đủ nhanh.

1. **HTML/srcmap không lưu trong Postgres** — lưu R2, DB chỉ giữ key + metadata. Neon free 0.5GB sống thoải mái; version lớn không phình DB. Retention: version không phải deployment hiện tại và không có `label` bị prune sau 90 ngày hoặc khi vượt 50 version/page (whichever trước) — chi tiết infra-deployment-cost.md §2, cột `pageVersions.prunedAt`.
2. **Idempotency thanh toán** nằm ở `uq_payment_tx` — webhook retry bao nhiêu lần cũng an toàn.
3. **`orders.code`**: 6 ký tự base32 không nhầm lẫn (bỏ 0/O/1/I) + 1 ký tự checksum tính từ 6 ký tự trước (thuật toán dạng mod-31 hoặc tương đương trên bảng chữ base32 đã chọn) — mục đích: phát hiện gõ sai 1 ký tự thay vì âm thầm khớp nhầm sang mã đơn hợp lệ khác. Prefix theo `paymentConfig.transferPrefix`; unique per org, sinh retry-on-conflict.
4. **RLS**: bật trên `leads, orders, payments, ai_connections, chat_messages, unmatched_transactions, refund_requests, payment_connections, consents` (bổ sung các bảng mới chứa dữ liệu nhạy cảm) — policy `org_id = current_setting('app.current_org')`; api set setting mỗi transaction. Trên CF Workers dùng Neon serverless driver (HTTP) — set qua `SET LOCAL` trong cùng transaction.
5. **Pipeline stages** để trong `organizations.settings.pipeline` (mảng {key,label,color}) — đổi không cần migration; `leads.stage` validate ở app layer.
6. **Migration flow**: `drizzle-kit generate` + migrate trong CI; seed platform skills bằng script `tooling/seed`.
7. **Extensibility đối tượng mới (FR-C-06)**: thêm giá trị `products.type` + JSON schema attributes đăng ký trong code — không đổi bảng.
8. **Atomic AI credit debit**: trừ `organizations.aiCreditBalance` phải nằm CÙNG transaction với insert `ai_usage`, dùng `UPDATE organizations SET ai_credit_balance = ai_credit_balance - $cost WHERE id = $orgId AND ai_credit_balance >= $cost RETURNING ai_credit_balance`; nếu 0 dòng được update → báo lỗi thiếu credit, rollback transaction, không insert `ai_usage`.
9. **Concurrency cho `pageVersions.seq`**: 2 patch đồng thời trên cùng landing page phải tránh đụng `uq_pv(landingPageId, seq)`; dùng `pg_advisory_xact_lock(hashtext(landing_page_id))` bọc quanh bước tính `seq` kế tiếp + insert, trong cùng transaction — không tính `seq` bằng cách đọc `MAX(seq)` rồi insert riêng lẻ (race condition).
10. **Publish/rollback outbox**: xem `publishOutbox` ở trên + architecture.md §5.2; `deployments.status` chỉ chuyển `live` sau khi outbox xác nhận đã áp KV, không set trực tiếp.
