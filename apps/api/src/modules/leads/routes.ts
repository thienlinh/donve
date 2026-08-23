import { encryptApiKey, importMasterKey } from "@dv/ai-gateway";
import {
  assignLeadSchema,
  assignmentRuleSchema,
  bulkDeleteLeadsSchema,
  bulkUpdateLeadsSchema,
  campaignPaymentConfigSchema,
  createDataSubjectRequestSchema,
  createLeadActivitySchema,
  createSavedViewSchema,
  dataSubjectRequestListSchema,
  dataSubjectRequestSchema,
  dataSubjectRequestStatusSchema,
  leadDetailSchema,
  leadImportRequestSchema,
  leadImportResultSchema,
  leadListQuerySchema,
  leadListResponseSchema,
  leadSchema,
  notifyCredentialSchema,
  orgSettingsSchema,
  salesConfigListSchema,
  salesConfigSchema,
  savedViewSchema,
  tiktokConnectionSchema,
  updateLeadOrderStatusSchema,
  updateLeadStageSchema,
  updateSalesConfigSchema,
  upsertAssignmentRuleSchema,
  upsertNotifyCredentialSchema,
  upsertWebhookCredentialSchema,
  webhookCredentialSchema,
  generateGenericApiKeyResultSchema
} from "@dv/contracts";
import {
  assignmentRulesRepository,
  auditLogsRepository,
  campaignsRepository,
  dataSubjectRequestsRepository,
  emailLogsRepository,
  leadActivitiesRepository,
  leadsRepository,
  membershipsRepository,
  notifyCredentialsRepository,
  ordersRepository,
  organizationsRepository,
  savedViewsRepository,
  tiktokConnectionsRepository,
  webhookCredentialsRepository,
  type Db
} from "@dv/db";
import { email } from "@dv/drivers";
import { Hono, type Context } from "hono";
import { streamSSE } from "hono/streaming";

import { createRealtimeFromEnv } from "../../lib/cache.js";
import { createDbFromEnv } from "../../lib/db.js";
import { ApiError } from "../../lib/errors.js";
import { log } from "../../lib/logger.js";
import { normalizeVnPhone } from "../../lib/phone.js";
import {
  leadStreamChannel,
  orderStreamChannel,
  publishNewLeads,
  publishOrderUpdate
} from "../../lib/realtime.js";
import type { AppEnv } from "../../types.js";
import { findOrCreateLead } from "../public/routes.js";
import { routeLead } from "./routing.js";
import { disconnectTiktok } from "./tiktok.js";

export const leadsRoutes = new Hono<AppEnv>();

function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

/** Same owner/admin gate used by `/pipeline`-adjacent config screens (sales-config, routing
 * rules, shared saved views) — everything an individual sales rep shouldn't be able to touch. */
function requireAdminOrOwner(c: Context<AppEnv>): void {
  const role = c.get("membershipRole");
  if (role !== "owner" && role !== "admin")
    throw new ApiError(403, "forbidden");
}

interface PipelineStage {
  key: string;
  label: string;
  color: string;
}

/** FR-E-02 default — used until an org customizes `organizations.settings.pipeline`. */
const DEFAULT_PIPELINE: PipelineStage[] = [
  { key: "new", label: "Mới", color: "#64748b" },
  { key: "contacted", label: "Đã liên hệ", color: "#3b82f6" },
  { key: "interested", label: "Quan tâm", color: "#f59e0b" },
  { key: "won", label: "Chốt", color: "#22c55e" },
  { key: "lost", label: "Huỷ", color: "#ef4444" }
];

async function getPipeline(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string
): Promise<PipelineStage[]> {
  const org = await organizationsRepository.findById(db, orgId);
  const settings = orgSettingsSchema.parse(org?.settings ?? {});
  return settings.pipeline && settings.pipeline.length > 0
    ? settings.pipeline
    : DEFAULT_PIPELINE;
}

/** FR-E-04 — sales without `seeAllLeads` only ever see their own assigned leads. */
function scopedAssigneeFilter(c: Context<AppEnv>, requested?: string) {
  const role = c.get("membershipRole");
  const salesConfig = c.get("salesConfig");
  if (role === "sales" && !salesConfig.seeAllLeads) return c.get("userId");
  return requested;
}

/** architecture.md §5.3: dashboard SSE hub — pub/sub (Upstash on Workers, plain Redis on
 * Bun/VPS, see `createRealtimeFromEnv`) fanned out per-connection as SSE, so a sales rep sees
 * an order flip to `paid`/`fulfilled` without polling or refreshing. */
leadsRoutes.get("/orders/stream", async (c) => {
  const orgId = requireOrgId(c);
  const driver = createRealtimeFromEnv(c.env);

  return streamSSE(c, async (stream) => {
    const controller = new AbortController();
    stream.onAbort(() => controller.abort());

    for await (const message of driver.subscribe(
      orderStreamChannel(orgId),
      controller.signal
    )) {
      await stream.writeSSE({ data: JSON.stringify(message.data) });
    }
  });
});

/** module E finding #4: in-app realtime bell — same pub/sub-fanned-to-SSE shape as
 * `/orders/stream` above, just a different channel (new-lead counts, not order transitions). */
leadsRoutes.get("/stream", async (c) => {
  const orgId = requireOrgId(c);
  const driver = createRealtimeFromEnv(c.env);

  return streamSSE(c, async (stream) => {
    const controller = new AbortController();
    stream.onAbort(() => controller.abort());

    for await (const message of driver.subscribe(
      leadStreamChannel(orgId),
      controller.signal
    )) {
      await stream.writeSSE({ data: JSON.stringify(message.data) });
    }
  });
});

leadsRoutes.get("/pipeline", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  return c.json({ stages: await getPipeline(db, orgId) });
});

leadsRoutes.get("/", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const query = leadListQuerySchema.parse(c.req.query());

  const { rows, total } = await leadsRepository.listFiltered(db, orgId, {
    ...query,
    assigneeId: scopedAssigneeFilter(c, query.assigneeId)
  });

  return c.json(
    leadListResponseSchema.parse({
      leads: rows,
      total,
      page: query.page,
      pageSize: query.pageSize
    })
  );
});

function csvCell(value: string | null): string {
  const s = value ?? "";
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const EXPORT_COLUMNS = [
  "id",
  "fullName",
  "phone",
  "email",
  "stage",
  "assigneeId",
  "campaignId",
  "createdAt"
] as const;

/** FR-E-07 — CSV export honoring the same filters as `GET /`, minus pagination. */
leadsRoutes.get("/export", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const query = leadListQuerySchema.parse(c.req.query());

  const rows = await leadsRepository.listForExport(db, orgId, {
    ...query,
    assigneeId: scopedAssigneeFilter(c, query.assigneeId)
  });

  const lines = [
    EXPORT_COLUMNS.join(","),
    ...rows.map((row) =>
      EXPORT_COLUMNS.map((col) =>
        csvCell(col === "createdAt" ? row.createdAt.toISOString() : row[col])
      ).join(",")
    )
  ];

  c.header("Content-Type", "text/csv; charset=utf-8");
  c.header(
    "Content-Disposition",
    `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`
  );
  return c.body(lines.join("\r\n"));
});

/** module E finding #3 — CSV import counterpart to `/export`. Reuses the exact same
 * race-safe dedupe-by-phone upsert (`findOrCreateLead`) the public lead-submission form
 * uses, so an imported row that matches an existing phone merges instead of duplicating. */
leadsRoutes.post("/import", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = leadImportRequestSchema.parse(await c.req.json());

  const campaign = await campaignsRepository.findById(
    db,
    orgId,
    body.campaignId
  );
  if (!campaign || campaign.deletedAt) {
    throw new ApiError(404, "campaign_not_found");
  }

  let created = 0;
  let merged = 0;
  const failed: { row: number; reason: string }[] = [];

  for (const [index, row] of body.rows.entries()) {
    const phone = normalizeVnPhone(row.phone);
    if (!phone) {
      failed.push({ row: index, reason: "invalid_phone" });
      continue;
    }
    try {
      // each row's dedupe check depends on any earlier row for the same phone already
      // having committed, can't run in parallel
      // oxlint-disable-next-line no-await-in-loop, react-doctor/async-await-in-loop
      const { lead: importedLead, merged: wasMerged } = await findOrCreateLead(
        db,
        {
          orgId,
          fullName: row.fullName,
          email: row.email ?? null,
          persona: row.persona ?? null,
          customFields: row.customFields,
          utm: {}
        },
        campaign,
        phone,
        "csv_import"
      );
      if (wasMerged) merged++;
      else {
        created++;
        // oxlint-disable-next-line no-await-in-loop -- same per-row sequencing as the dedupe call above
        await routeLead(db, orgId, importedLead);
      }
    } catch (err) {
      failed.push({
        row: index,
        reason: err instanceof Error ? err.message : "unknown_error"
      });
    }
  }

  if (created > 0) await publishNewLeads(c.env, orgId, created);
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.import",
    targetType: "campaign",
    targetId: campaign.id,
    meta: { created, merged, failed: failed.length }
  });

  return c.json(leadImportResultSchema.parse({ created, merged, failed }));
});

/** Org-wide list (no `:leadId`) — feeds the top-bar overdue/due-soon indicator. Must be
 * registered before `GET /:id` below — Hono matches routes in registration order, and a
 * single path segment like "data-subject-requests" would otherwise be swallowed by `:id`
 * (found live: this exact route 404'd as `lead_not_found` before being moved here). */
leadsRoutes.get("/data-subject-requests", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const statusParam = c.req.query("status");
  const status = statusParam
    ? dataSubjectRequestStatusSchema.parse(statusParam)
    : undefined;

  const rows = await dataSubjectRequestsRepository.listByStatus(
    db,
    orgId,
    status
  );
  return c.json(
    dataSubjectRequestListSchema.parse({ dataSubjectRequests: rows })
  );
});

/** `assignmentRules.onSlaBreach` is a DB text-enum, but the contract's field is a plain
 * `z.string().nullable()` (SLA-breach automation is a later phase, see schema comment) — this
 * is the narrowing the DB insert/update calls need since TS can't infer it from the contract. */
const ON_SLA_BREACH_VALUES = [
  "reassign_next_in_pool",
  "notify_manager"
] as const;
type OnSlaBreach = (typeof ON_SLA_BREACH_VALUES)[number];

function parseOnSlaBreach(
  value: string | null | undefined
): OnSlaBreach | null | undefined {
  if (value == null) return value;
  if (!(ON_SLA_BREACH_VALUES as readonly string[]).includes(value)) {
    throw new ApiError(400, "invalid_on_sla_breach");
  }
  return value as OnSlaBreach;
}

/** module: auto-assignment routing engine — rule config, admin/owner only. Registered before
 * `GET /:id` for the same single-path-segment reason as `/data-subject-requests` above. */
leadsRoutes.get("/assignment-rules", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);

  const rows = await assignmentRulesRepository.listActive(db, orgId);
  return c.json(rows.map((row) => assignmentRuleSchema.parse(row)));
});

leadsRoutes.post("/assignment-rules", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);
  const body = upsertAssignmentRuleSchema.parse(await c.req.json());

  const created = await assignmentRulesRepository.insert(db, orgId, {
    ...body,
    onSlaBreach: parseOnSlaBreach(body.onSlaBreach)
  });
  if (!created) throw new ApiError(500, "assignment_rule_insert_failed");
  return c.json(assignmentRuleSchema.parse(created), 201);
});

leadsRoutes.patch("/assignment-rules/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);
  const id = c.req.param("id");
  const body = upsertAssignmentRuleSchema.partial().parse(await c.req.json());

  const existing = await assignmentRulesRepository.findById(db, orgId, id);
  if (!existing || existing.deletedAt) {
    throw new ApiError(404, "assignment_rule_not_found");
  }

  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- existence check must throw before this write fires
  const updated = await assignmentRulesRepository.update(db, orgId, id, {
    ...body,
    onSlaBreach: parseOnSlaBreach(body.onSlaBreach)
  });
  return c.json(assignmentRuleSchema.parse(updated));
});

leadsRoutes.delete("/assignment-rules/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);
  const id = c.req.param("id");

  const existing = await assignmentRulesRepository.findById(db, orgId, id);
  if (!existing || existing.deletedAt) {
    throw new ApiError(404, "assignment_rule_not_found");
  }

  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- existence check must throw before this write fires
  await assignmentRulesRepository.update(db, orgId, id, {
    deletedAt: new Date()
  });
  return c.json({ ok: true });
});

const WEBHOOK_PROVIDERS = [
  "facebook",
  "zalo_oa",
  "generic",
  "google_ads"
] as const;
type WebhookProviderParam = (typeof WEBHOOK_PROVIDERS)[number];

function parseWebhookProvider(raw: string): WebhookProviderParam {
  if (!WEBHOOK_PROVIDERS.includes(raw as WebhookProviderParam)) {
    throw new ApiError(400, "invalid_webhook_provider");
  }
  return raw as WebhookProviderParam;
}

// Donve-generated (never org-pasted) providers — `PUT .../:provider` is blocked for these, the
// only way to set/rotate the secret is `POST .../:provider/generate` below, so an org can't
// weaken it to a guessable value of their own choosing.
const DONVE_GENERATED_PROVIDERS = new Set<WebhookProviderParam>([
  "generic",
  "google_ads"
]);

/** Per-org Facebook/Zalo OA webhook secret override (lead-integrations.md §4) — admin/owner
 * only, since this controls who can inject leads into the org. The secret itself is write-only:
 * `GET` never returns it, only whether one is configured. */
leadsRoutes.get("/webhook-credentials", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);

  const rows = await Promise.all(
    WEBHOOK_PROVIDERS.map(async (provider) => {
      const row = await webhookCredentialsRepository.findByOrgAndProvider(
        db,
        orgId,
        provider
      );
      return webhookCredentialSchema.parse({
        provider,
        configured: Boolean(row),
        verifyToken: row?.verifyToken ?? null,
        pageAccessTokenConfigured: Boolean(row?.encryptedPageAccessToken),
        updatedAt: row?.updatedAt ?? null,
        lastUsedAt: row?.lastUsedAt ?? null
      });
    })
  );
  return c.json(rows);
});

leadsRoutes.put("/webhook-credentials/:provider", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);
  const provider = parseWebhookProvider(c.req.param("provider"));
  if (DONVE_GENERATED_PROVIDERS.has(provider)) {
    throw new ApiError(400, "invalid_webhook_provider");
  }
  const body = upsertWebhookCredentialSchema.parse(await c.req.json());

  const masterKey = await importMasterKey(c.env.WEBHOOK_KEY_MASTER_SECRET);
  const encryptedSecret = await encryptApiKey(body.secret, masterKey);
  const encryptedPageAccessToken = body.pageAccessToken
    ? await encryptApiKey(body.pageAccessToken, masterKey)
    : undefined;
  await webhookCredentialsRepository.upsert(db, orgId, provider, {
    encryptedSecret,
    verifyToken: body.verifyToken ?? null,
    ...(encryptedPageAccessToken ? { encryptedPageAccessToken } : {})
  });
  return c.json({ ok: true });
});

leadsRoutes.delete("/webhook-credentials/:provider", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);
  const provider = parseWebhookProvider(c.req.param("provider"));

  await webhookCredentialsRepository.remove(db, orgId, provider);
  return c.json({ ok: true });
});

/** Generates (or rotates) the org's Donve-side API key for either `POST /webhooks/generic-leads`
 * (the no-code-friendly bridge target for any server-to-server forwarder that can't produce a
 * Turnstile token, lead-integrations.md §D) or `POST /webhooks/google-ads-leads` (`google_key`
 * the org pastes into the Google Ads Lead Form asset's own webhook settings — Google echoes it
 * back in every POST body, see lead-integrations.md §E). The plaintext key is returned ONLY in
 * this response — `GET /webhook-credentials` only ever reports `configured: true` afterward,
 * same as Facebook/Zalo secrets never being readable back. Rotating replaces the old key outright
 * (single active key per org, no grace-period overlap — simplest correct behavior for a key an
 * org can regenerate freely if a caller needs updating). */
leadsRoutes.post("/webhook-credentials/:provider/generate", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);
  const provider = parseWebhookProvider(c.req.param("provider"));
  if (!DONVE_GENERATED_PROVIDERS.has(provider)) {
    throw new ApiError(400, "invalid_webhook_provider");
  }

  const apiKey = crypto.randomUUID().replaceAll("-", "");
  const masterKey = await importMasterKey(c.env.WEBHOOK_KEY_MASTER_SECRET);
  const encryptedSecret = await encryptApiKey(apiKey, masterKey);
  await webhookCredentialsRepository.upsert(db, orgId, provider, {
    encryptedSecret,
    verifyToken: null
  });
  return c.json(generateGenericApiKeyResultSchema.parse({ apiKey }));
});

/** Status for the "Kết nối TikTok Ads" card (lead-integrations.md §D) — admin/owner only, same
 * gating as every other webhook-settings read. Returns every campaign that currently has a live
 * connection for this org; the Settings UI matches rows to campaigns client-side the same way it
 * already does for the campaign picker. */
leadsRoutes.get("/tiktok-connections", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);

  const rows = await tiktokConnectionsRepository.list(db, orgId);
  return c.json(
    rows.map((row) =>
      tiktokConnectionSchema.parse({
        campaignId: row.campaignId,
        advertiserId: row.advertiserId,
        connectedAt: row.createdAt
      })
    )
  );
});

leadsRoutes.delete("/tiktok-connections/:campaignId", async (c) => {
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);
  const campaignId = c.req.param("campaignId");

  await disconnectTiktok(c.env, orgId, campaignId);
  return c.json({ ok: true });
});

const NOTIFY_PROVIDERS = ["zalo_zns", "esms"] as const;
type NotifyProviderParam = (typeof NOTIFY_PROVIDERS)[number];

function parseNotifyProvider(raw: string): NotifyProviderParam {
  if (!NOTIFY_PROVIDERS.includes(raw as NotifyProviderParam)) {
    throw new ApiError(400, "invalid_notify_provider");
  }
  return raw as NotifyProviderParam;
}

function requireNotifyMasterKey(c: Context<AppEnv>): string {
  if (!c.env.NOTIFY_KEY_MASTER_SECRET) {
    throw new ApiError(501, "notify_key_master_secret_unconfigured");
  }
  return c.env.NOTIFY_KEY_MASTER_SECRET;
}

/** BYOK credentials for the `notify_manager` push channel (packages/drivers/src/notify) —
 * admin/owner only, same secret-is-write-only shape as `/webhook-credentials`. */
leadsRoutes.get("/notify-credentials", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);

  const rows = await Promise.all(
    NOTIFY_PROVIDERS.map(async (provider) => {
      const row = await notifyCredentialsRepository.findByOrgAndProvider(
        db,
        orgId,
        provider
      );
      return notifyCredentialSchema.parse({
        provider,
        configured: Boolean(row),
        config: row?.config ?? {},
        updatedAt: row?.updatedAt ?? null
      });
    })
  );
  return c.json(rows);
});

leadsRoutes.put("/notify-credentials/:provider", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);
  const provider = parseNotifyProvider(c.req.param("provider"));
  const body = upsertNotifyCredentialSchema.parse({
    provider,
    ...(await c.req.json())
  });
  if (body.provider !== provider) {
    throw new ApiError(400, "invalid_notify_provider");
  }

  const masterKey = await importMasterKey(requireNotifyMasterKey(c));
  const secret =
    body.provider === "zalo_zns"
      ? { accessToken: body.accessToken }
      : { apiKey: body.apiKey, secretKey: body.secretKey };
  const encryptedSecret = await encryptApiKey(
    JSON.stringify(secret),
    masterKey
  );
  const config: Record<string, string> =
    body.provider === "zalo_zns"
      ? { templateId: body.templateId }
      : body.brandname
        ? { brandname: body.brandname }
        : {};

  await notifyCredentialsRepository.upsert(db, orgId, provider, {
    encryptedSecret,
    config
  });
  return c.json({ ok: true });
});

leadsRoutes.delete("/notify-credentials/:provider", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  requireAdminOrOwner(c);
  const provider = parseNotifyProvider(c.req.param("provider"));

  await notifyCredentialsRepository.remove(db, orgId, provider);
  return c.json({ ok: true });
});

/** Saved lead-list filter presets. `GET` returns the caller's own views plus every shared
 * (org-wide) one; only owner/admin can create a shared view. */
leadsRoutes.get("/saved-views", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);

  const rows = await savedViewsRepository.listVisible(
    db,
    orgId,
    c.get("userId")
  );
  return c.json(
    rows.map((row) => savedViewSchema.parse({ ...row, ownerId: row.userId }))
  );
});

leadsRoutes.post("/saved-views", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = createSavedViewSchema.parse(await c.req.json());
  if (body.shared) requireAdminOrOwner(c);

  const created = await savedViewsRepository.insert(db, orgId, {
    userId: c.get("userId"),
    name: body.name,
    filterJson: body.filterJson,
    shared: body.shared
  });
  if (!created) throw new ApiError(500, "saved_view_insert_failed");
  return c.json(
    savedViewSchema.parse({ ...created, ownerId: created.userId }),
    201
  );
});

leadsRoutes.delete("/saved-views/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const existing = await savedViewsRepository.findById(db, orgId, id);
  if (!existing) throw new ApiError(404, "saved_view_not_found");

  const role = c.get("membershipRole");
  const isOwnRow = existing.userId === c.get("userId");
  if (!isOwnRow && role !== "owner" && role !== "admin") {
    throw new ApiError(403, "forbidden");
  }

  await savedViewsRepository.remove(db, orgId, id);
  return c.json({ ok: true });
});

/** `PATCH`/`DELETE /bulk` — table/kanban multi-select actions, reusing the exact same
 * per-lead activity-logging paths (`applyStageChange`/`applyAssigneeChange`) as the
 * single-lead endpoints so a bulk op leaves an identical audit trail. */
leadsRoutes.patch("/bulk", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = bulkUpdateLeadsSchema.parse(await c.req.json());
  if (body.leadIds.length > BULK_BATCH_MAX) {
    throw new ApiError(400, "bulk_batch_too_large");
  }

  if (body.stage) {
    const pipeline = await getPipeline(db, orgId);
    if (!pipeline.some((stage) => stage.key === body.stage)) {
      throw new ApiError(400, "invalid_stage");
    }
  }

  const leadsInScope = await findVisibleLeadsForBulk(
    c,
    db,
    orgId,
    body.leadIds
  );
  const actorId = c.get("userId");
  for (const lead of leadsInScope) {
    // each row needs its own before/after values for the activity log — can't batch this write
    if (body.stage) {
      // oxlint-disable-next-line no-await-in-loop, react-doctor/async-await-in-loop
      await applyStageChange(db, orgId, actorId, lead, body.stage);
    }
    if (body.assigneeId !== undefined) {
      // oxlint-disable-next-line no-await-in-loop, react-doctor/async-await-in-loop
      await applyAssigneeChange(db, orgId, actorId, lead, body.assigneeId);
    }
  }

  await auditLogsRepository.insert(db, orgId, {
    actorId,
    action: "lead.bulk_update",
    targetType: "lead",
    targetId: null,
    meta: {
      requested: body.leadIds.length,
      updated: leadsInScope.length,
      stage: body.stage ?? null,
      assigneeId: body.assigneeId ?? null
    }
  });

  return c.json({ ok: true, updated: leadsInScope.length });
});

leadsRoutes.delete("/bulk", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = bulkDeleteLeadsSchema.parse(await c.req.json());
  if (body.leadIds.length > BULK_BATCH_MAX) {
    throw new ApiError(400, "bulk_batch_too_large");
  }

  const leadsInScope = await findVisibleLeadsForBulk(
    c,
    db,
    orgId,
    body.leadIds
  );
  const actorId = c.get("userId");
  for (const lead of leadsInScope) {
    // oxlint-disable-next-line no-await-in-loop, react-doctor/async-await-in-loop -- soft-delete, one row at a time
    await leadsRepository.update(db, orgId, lead.id, { deletedAt: new Date() });
  }

  await auditLogsRepository.insert(db, orgId, {
    actorId,
    action: "lead.bulk_delete",
    targetType: "lead",
    targetId: null,
    meta: { requested: body.leadIds.length, deleted: leadsInScope.length }
  });

  return c.json({ ok: true, deleted: leadsInScope.length });
});

async function findVisibleLead(
  c: Context<AppEnv>,
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  id: string
) {
  const lead = await leadsRepository.findById(db, orgId, id);
  if (!lead || lead.deletedAt) throw new ApiError(404, "lead_not_found");

  const role = c.get("membershipRole");
  const salesConfig = c.get("salesConfig");
  if (
    role === "sales" &&
    !salesConfig.seeAllLeads &&
    lead.assigneeId !== c.get("userId")
  ) {
    throw new ApiError(404, "lead_not_found");
  }
  return lead;
}

/** Shared with `PATCH /bulk` — the exact stage-change write + activity log a single-lead
 * `PATCH /:id/stage` does, so the bulk path never diverges from what one lead gets. */
async function applyStageChange(
  db: Db,
  orgId: string,
  actorId: string,
  lead: NonNullable<Awaited<ReturnType<typeof leadsRepository.findById>>>,
  stage: string
) {
  const updated = await leadsRepository.update(db, orgId, lead.id, { stage });
  await leadActivitiesRepository.insert(db, orgId, {
    leadId: lead.id,
    type: "stage_change",
    body: null,
    meta: { from: lead.stage, to: stage },
    actorId
  });
  return updated;
}

/** Shared with `PATCH /bulk` — the exact assignee-change write + activity log a single-lead
 * `PATCH /:id/assignee` does. */
async function applyAssigneeChange(
  db: Db,
  orgId: string,
  actorId: string,
  lead: NonNullable<Awaited<ReturnType<typeof leadsRepository.findById>>>,
  assigneeId: string | null
) {
  const updated = await leadsRepository.update(db, orgId, lead.id, {
    assigneeId
  });
  await leadActivitiesRepository.insert(db, orgId, {
    leadId: lead.id,
    type: "system",
    body: null,
    meta: { from: lead.assigneeId, to: assigneeId, kind: "assignment" },
    actorId
  });
  return updated;
}

/** `PATCH`/`DELETE /bulk` — same org-scoping + FR-E-04 sales visibility rule as
 * `findVisibleLead`, applied to a batch. Ids outside the caller's org or visibility are
 * silently dropped rather than failing the whole request — the response's updated/deleted
 * count tells the caller how many actually applied. */
async function findVisibleLeadsForBulk(
  c: Context<AppEnv>,
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  ids: string[]
) {
  const rows = await leadsRepository.findManyByIds(db, orgId, ids);
  const role = c.get("membershipRole");
  const salesConfig = c.get("salesConfig");
  if (role === "sales" && !salesConfig.seeAllLeads) {
    const userId = c.get("userId");
    return rows.filter((lead) => lead.assigneeId === userId);
  }
  return rows;
}

const BULK_BATCH_MAX = 500;

leadsRoutes.get("/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const lead = await findVisibleLead(c, db, orgId, id);
  const [activities, orders, campaign] = await Promise.all([
    leadActivitiesRepository.listForLead(db, orgId, id),
    ordersRepository.listForLead(db, orgId, id),
    campaignsRepository.findById(db, orgId, lead.campaignId)
  ]);

  return c.json(
    leadDetailSchema.parse({
      lead,
      activities,
      orders,
      campaign: campaign ? { id: campaign.id, name: campaign.name } : null
    })
  );
});

leadsRoutes.patch("/:id/stage", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = updateLeadStageSchema.parse(await c.req.json());

  const [lead, pipeline] = await Promise.all([
    findVisibleLead(c, db, orgId, id),
    getPipeline(db, orgId)
  ]);
  if (!pipeline.some((stage) => stage.key === body.stage)) {
    throw new ApiError(400, "invalid_stage");
  }

  const updated = await applyStageChange(
    db,
    orgId,
    c.get("userId"),
    lead,
    body.stage
  );
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.stage_change",
    targetType: "lead",
    targetId: id,
    meta: { from: lead.stage, to: body.stage }
  });

  return c.json(leadSchema.parse(updated));
});

leadsRoutes.patch("/:id/assignee", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = assignLeadSchema.parse(await c.req.json());

  const lead = await findVisibleLead(c, db, orgId, id);
  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- visibility check must throw before this write fires, not run alongside it
  const updated = await applyAssigneeChange(
    db,
    orgId,
    c.get("userId"),
    lead,
    body.assigneeId
  );
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.assignee_change",
    targetType: "lead",
    targetId: id,
    meta: { from: lead.assigneeId, to: body.assigneeId }
  });

  return c.json(leadSchema.parse(updated));
});

/** Dashboard "unread" indicator — fired (fire-and-forget) when the lead detail sheet opens. */
leadsRoutes.patch("/:id/viewed", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  await findVisibleLead(c, db, orgId, id);
  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- visibility check must throw before this write fires, not run alongside it
  const updated = await leadsRepository.update(db, orgId, id, {
    lastViewedAt: new Date()
  });
  return c.json(leadSchema.parse(updated));
});

leadsRoutes.post("/:id/activities", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = createLeadActivitySchema.parse(await c.req.json());

  await findVisibleLead(c, db, orgId, id);
  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- the visibility
  // check must complete (and possibly throw) BEFORE the write fires, not alongside it.
  const activity = await leadActivitiesRepository.insert(db, orgId, {
    leadId: id,
    type: body.type,
    body: body.body,
    meta: {},
    actorId: c.get("userId")
  });

  return c.json(activity, 201);
});

/** Allowed transitions for FR-E-05 quick actions — everything else (refund, dispute) routes
 * through the dedicated flows in FR-D-11..14, not this generic endpoint. */
const ALLOWED_ORDER_TRANSITIONS: Record<string, string[]> = {
  pending: ["awaiting_confirmation", "paid", "cancelled"],
  awaiting_confirmation: ["paid", "cancelled"],
  paid: ["fulfilled"]
};

/** FR-I-04 — best-effort: a failed send must not undo the (already persisted) status change. */
async function maybeSendOrderConfirmationEmail(
  db: Db,
  env: { RESEND_API_KEY: string },
  orgId: string,
  order: { id: string; code: string; campaignId: string; amount: string },
  status: "paid" | "fulfilled",
  leadEmail: string | null
): Promise<void> {
  if (!env.RESEND_API_KEY || !leadEmail) return;

  const campaign = await campaignsRepository.findById(
    db,
    orgId,
    order.campaignId
  );
  const paymentConfig = campaignPaymentConfigSchema.parse(
    campaign?.paymentConfig
  );
  if (!paymentConfig.emailConfirmationEnabled) return;

  try {
    const sender = email.createResendEmailSender({
      apiKey: env.RESEND_API_KEY
    });
    const result = await sender.send({
      to: leadEmail,
      template: "order_confirmation",
      props: { orderCode: order.code, status, amount: Number(order.amount) }
    });
    await emailLogsRepository.insert(db, {
      orgId,
      to: leadEmail,
      template: "order_confirmation",
      resendId: result.id,
      status: "sent"
    });
  } catch (err) {
    log("error", {
      requestId: "order-confirmation-email",
      orgId,
      message: "order confirmation email failed",
      error: err instanceof Error ? err.message : String(err)
    });
  }
}

leadsRoutes.patch("/:id/orders/:orderId", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const orderId = c.req.param("orderId");
  const body = updateLeadOrderStatusSchema.parse(await c.req.json());

  const lead = await findVisibleLead(c, db, orgId, id);
  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- visibility check must throw before this read fires, not run alongside it
  const order = await ordersRepository.findById(db, orgId, orderId);
  if (!order || order.leadId !== id) throw new ApiError(404, "order_not_found");

  const allowed = ALLOWED_ORDER_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(body.status)) {
    throw new ApiError(400, "invalid_order_transition");
  }

  const now = new Date();
  const updated = await ordersRepository.update(db, orgId, orderId, {
    status: body.status,
    paidAt: body.status === "paid" ? now : order.paidAt,
    fulfilledAt: body.status === "fulfilled" ? now : order.fulfilledAt
  });
  if (updated) await publishOrderUpdate(c.env, orgId, updated);
  // FR-D-08: every sales-driven status change logs its reason.
  await leadActivitiesRepository.insert(db, orgId, {
    leadId: id,
    type: body.status === "paid" ? "payment" : "system",
    body: null,
    meta: { orderId, from: order.status, to: body.status, reason: body.reason },
    actorId: c.get("userId")
  });
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "order.status_change",
    targetType: "order",
    targetId: orderId,
    meta: { from: order.status, to: body.status, reason: body.reason }
  });

  if (body.status === "paid" || body.status === "fulfilled") {
    await maybeSendOrderConfirmationEmail(
      db,
      c.env,
      orgId,
      order,
      body.status,
      lead.email
    );
  }

  return c.json(updated);
});

/** NFR-10 — right to erasure/rectification (Nghị định 13/2023/NĐ-CP). Ops triggers this once a
 * deletion/export request (received by email, 72h SLA — no in-app intake flow) is verified;
 * orders/payments are left intact as accounting evidence per NFR-11. Owner/admin only. */
leadsRoutes.post("/:id/anonymize", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const role = c.get("membershipRole");
  if (role !== "owner" && role !== "admin")
    throw new ApiError(403, "forbidden");

  const lead = await findVisibleLead(c, db, orgId, id);
  if (lead.anonymizedAt) return c.json(leadSchema.parse(lead));

  const updated = await leadsRepository.anonymize(db, orgId, id);
  await leadActivitiesRepository.insert(db, orgId, {
    leadId: id,
    type: "system",
    body: null,
    meta: { kind: "anonymized" },
    actorId: c.get("userId")
  });
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.anonymize",
    targetType: "lead",
    targetId: id,
    meta: {}
  });

  return c.json(leadSchema.parse(updated));
});

const DSR_SLA_HOURS = 72;

/** NFR-10 (Nghị định 13/2023/NĐ-CP) — a lead's delete/export request, logged from the lead
 * detail sheet against the org's own 72h response SLA (NFR-12: the org is the data
 * controller, not the platform — there is no in-app intake from the lead's side). */
leadsRoutes.post("/:id/data-subject-requests", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = createDataSubjectRequestSchema.parse(await c.req.json());

  await findVisibleLead(c, db, orgId, id);
  const receivedAt = body.receivedAt ?? new Date();
  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- visibility check must throw before this write fires, not run alongside it
  const created = await dataSubjectRequestsRepository.insert(db, orgId, {
    leadId: id,
    requestType: body.requestType,
    receivedAt,
    dueAt: new Date(receivedAt.getTime() + DSR_SLA_HOURS * 60 * 60 * 1000),
    notes: body.notes ?? null
  });
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.data_subject_request_create",
    targetType: "lead",
    targetId: id,
    meta: { requestType: body.requestType }
  });

  return c.json(dataSubjectRequestSchema.parse(created), 201);
});

leadsRoutes.get("/:id/data-subject-requests", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  await findVisibleLead(c, db, orgId, id);
  const rows = await dataSubjectRequestsRepository.listForLead(db, orgId, id);
  return c.json(
    dataSubjectRequestListSchema.parse({ dataSubjectRequests: rows })
  );
});

leadsRoutes.patch("/:id/data-subject-requests/:requestId", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const requestId = c.req.param("requestId");

  await findVisibleLead(c, db, orgId, id);
  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- visibility check must throw before this read fires, not run alongside it
  const existing = await dataSubjectRequestsRepository.findById(
    db,
    orgId,
    requestId
  );
  if (!existing || existing.leadId !== id) {
    throw new ApiError(404, "data_subject_request_not_found");
  }

  const updated = await dataSubjectRequestsRepository.complete(
    db,
    orgId,
    requestId
  );
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "lead.data_subject_request_complete",
    targetType: "lead",
    targetId: id,
    meta: { requestId }
  });

  return c.json(dataSubjectRequestSchema.parse(updated));
});

/** FR-E-04 — owner/admin reads current `seeAllLeads` per sales member, to render the toggle. */
leadsRoutes.get("/members/sales-config", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);

  const role = c.get("membershipRole");
  if (role !== "owner" && role !== "admin")
    throw new ApiError(403, "forbidden");

  const salesMembers = await membershipsRepository.listByRole(
    db,
    orgId,
    "sales"
  );
  return c.json(
    salesConfigListSchema.parse({
      members: salesMembers.map((member) => ({
        membershipId: member.id,
        userId: member.userId,
        seeAllLeads: Boolean(
          salesConfigSchema.parse(member.salesConfig ?? {}).seeAllLeads
        )
      }))
    })
  );
});

/** FR-E-04 — owner/admin toggles whether a sales member sees all org leads or only their own. */
leadsRoutes.patch("/members/:membershipId/sales-config", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const membershipId = c.req.param("membershipId");
  const body = updateSalesConfigSchema.parse(await c.req.json());

  const role = c.get("membershipRole");
  if (role !== "owner" && role !== "admin")
    throw new ApiError(403, "forbidden");

  const membership = await membershipsRepository.findById(
    db,
    orgId,
    membershipId
  );
  if (!membership) throw new ApiError(404, "membership_not_found");

  const updated = await membershipsRepository.update(db, orgId, membershipId, {
    salesConfig: {
      ...salesConfigSchema.parse(membership.salesConfig ?? {}),
      seeAllLeads: body.seeAllLeads
    }
  });

  return c.json({ salesConfig: updated?.salesConfig ?? {} });
});
