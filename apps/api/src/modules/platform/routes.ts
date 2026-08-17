import { organizationSchema, platformWhoAmISchema } from "@dv/contracts";
import { organizationsRepository, platformAuditLogsRepository } from "@dv/db";
import { Hono } from "hono";
import { z } from "zod";

import { createDbFromEnv } from "../../lib/db.js";
import type { AppEnv } from "../../types.js";

/**
 * First `/platform/*` routes (docs/architecture/platform-admin.md §7 step 3) — read-only,
 * intentionally the only ones until a real ops case needs more. Handlers that read tenant
 * data record a `platform_audit_logs` row before responding — not optional (platform-admin.md
 * §4). `/whoami` is exempt: it exposes no tenant data, just confirms staff identity, and the
 * dashboard calls it on every navigation to `/platform` — logging that would just be noise
 * diluting the audit trail for actual cross-tenant reads.
 */
export const platformRoutes = new Hono<AppEnv>();

platformRoutes.get("/whoami", (c) =>
  c.json(
    platformWhoAmISchema.parse({
      staffId: c.get("platformStaffId"),
      role: c.get("platformStaffRole")
    })
  )
);

platformRoutes.get("/orgs", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgs = await organizationsRepository.listAll(db);

  await platformAuditLogsRepository.record(db, {
    staffUserId: c.get("platformStaffId"),
    action: "org.list",
    targetOrgId: null,
    targetType: "organization",
    targetId: null,
    meta: null
  });

  return c.json({ orgs: z.array(organizationSchema).parse(orgs) });
});
