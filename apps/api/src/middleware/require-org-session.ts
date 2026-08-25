import { salesConfigSchema } from "@dv/contracts";
import { membershipsRepository, organizationsRepository } from "@dv/db";
import { createMiddleware } from "hono/factory";

import { createAuthFromEnv } from "../lib/auth.js";
import { createDbFromEnv } from "../lib/db.js";
import { ApiError } from "../lib/errors.js";
import type { AppEnv } from "../types.js";

/**
 * Gate for every tenant `/api/*` route that needs `c.get("orgId")`. A valid session alone
 * isn't enough — the session's active org (set via the org plugin's `setActive`) must also
 * have a `memberships` row for this user, otherwise a stale/foreign `activeOrganizationId`
 * would let a request read another org's data.
 */
export const requireOrgSession = createMiddleware<AppEnv>(async (c, next) => {
  const auth = createAuthFromEnv(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) throw new ApiError(401, "unauthorized");

  const orgId = session.session.activeOrganizationId;
  if (!orgId) throw new ApiError(403, "no_active_organization");

  const db = createDbFromEnv(c.env);
  // One extra read per request, deliberately: this is the single chokepoint every tenant
  // `/api/*` call passes through, so a platform-level disable (platform-admin.md §11) only
  // actually locks the org out if it's checked here rather than in each module.
  const [membership, org] = await Promise.all([
    membershipsRepository.findByUserId(db, orgId, session.user.id),
    organizationsRepository.findById(db, orgId)
  ]);
  if (!membership) throw new ApiError(403, "forbidden");
  if (org?.disabledAt) throw new ApiError(403, "org_disabled");

  c.set("orgId", orgId);
  c.set("userId", session.user.id);
  c.set("membershipRole", membership.role);
  c.set("salesConfig", salesConfigSchema.parse(membership.salesConfig ?? {}));
  await next();
});
