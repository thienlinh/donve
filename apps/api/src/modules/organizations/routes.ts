import { auditLogSchema, orgSettingsSchema } from "@dv/contracts";
import { auditLogsRepository, organizationsRepository } from "@dv/db";
import { Hono, type Context } from "hono";
import { z } from "zod";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import type { AppEnv } from "@/types.js";

export const organizationsRoutes = new Hono<AppEnv>();

function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

organizationsRoutes.get("/settings", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const org = await organizationsRepository.findById(db, orgId);
  if (!org) throw new ApiError(404, "org_not_found");
  return c.json(orgSettingsSchema.parse(org.settings ?? {}));
});

/** FR-I-03 etc — owner/admin only; merges onto existing settings so one PATCH (e.g. just
 * `leadDigestFrequency`) never wipes unrelated fields like `pipeline`/`timezone`. */
organizationsRoutes.patch("/settings", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);

  const role = c.get("membershipRole");
  if (role !== "owner" && role !== "admin") {
    throw new ApiError(403, "forbidden");
  }

  const body = orgSettingsSchema.parse(await c.req.json());
  const org = await organizationsRepository.findById(db, orgId);
  if (!org) throw new ApiError(404, "org_not_found");

  const updated = await organizationsRepository.update(db, orgId, {
    settings: { ...orgSettingsSchema.parse(org.settings ?? {}), ...body }
  });
  return c.json(orgSettingsSchema.parse(updated?.settings ?? {}));
});

/** FR-A-05 — owner/admin only, most recent 200 writes across the org. */
organizationsRoutes.get("/audit-logs", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);

  const role = c.get("membershipRole");
  if (role !== "owner" && role !== "admin") {
    throw new ApiError(403, "forbidden");
  }

  const logs = await auditLogsRepository.listRecent(db, orgId);
  return c.json({ logs: z.array(auditLogSchema).parse(logs) });
});
