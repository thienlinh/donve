import { hasFeature } from "@dv/db";
import { createMiddleware } from "hono/factory";

import { createDbFromEnv } from "../lib/db.js";
import { ApiError } from "../lib/errors.js";
import type { AppEnv } from "../types.js";

/**
 * Subscription gate for a paid feature (docs/architecture/platform-admin.md §12) — must be
 * mounted after `requireOrgSession`, which is what puts `orgId` in the context. The org's plan
 * decides by default; a `org_feature_overrides` row wins over it, which is how platform staff
 * turn a feature on for one customer before they upgrade (`PATCH /platform/orgs/:id/subscription`).
 *
 * The 403 message carries the feature key rather than a plan name: which plans include a key
 * lives in `plan_features` data, not in code, so naming a plan here would go stale silently.
 * The app maps the key to its own upgrade copy.
 */
export const requireFeature = (key: string) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const orgId = c.get("orgId");
    if (!orgId) throw new ApiError(500, "missing_org_context");

    const enabled = await hasFeature(createDbFromEnv(c.env), orgId, key);
    if (!enabled) {
      throw new ApiError(403, "feature_not_in_plan", `feature_required:${key}`);
    }
    await next();
  });
