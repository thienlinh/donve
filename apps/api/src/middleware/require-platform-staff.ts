import { platformStaffRoleValues, type PlatformStaffRole } from "@dv/contracts";
import { platformStaffRepository } from "@dv/db";
import { createMiddleware } from "hono/factory";

import { createAuthFromEnv } from "../lib/auth.js";
import { createDbFromEnv } from "../lib/db.js";
import { ApiError } from "../lib/errors.js";
import type { AppEnv } from "../types.js";

/** `platformStaffRoleValues` is ordered least → most privileged (packages/contracts/src/platform.ts,
 * platform-admin.md §10), so index comparison IS the privilege comparison. */
function satisfies(role: PlatformStaffRole, minRole: PlatformStaffRole) {
  return (
    platformStaffRoleValues.indexOf(role) >=
    platformStaffRoleValues.indexOf(minRole)
  );
}

/**
 * Gate for every `/platform/*` route (docs/architecture/platform-admin.md §4) — separate from
 * tenant auth entirely. A valid session alone isn't enough: the session's user must also have
 * a row in `platform_staff` (granted by hand, see platform-admin.md §6 — no self-serve signup)
 * with at least `minRole`.
 *
 * Mounted once app-wide with the lowest role (`support`) and re-applied per route for the
 * higher-privilege write endpoints. That second pass reuses the role already in the request
 * context instead of re-reading the session + `platform_staff` row, so stacking gates costs
 * nothing — the identity was already resolved by the app-wide mount.
 */
export const requirePlatformStaff = (minRole: PlatformStaffRole) =>
  createMiddleware<AppEnv>(async (c, next) => {
    // Typed as possibly-undefined on purpose: `Variables.platformStaffRole` is only set once
    // the app-wide mount below has run, and this same factory backs that first pass.
    let role: PlatformStaffRole | undefined = c.get("platformStaffRole");

    if (!role) {
      const auth = createAuthFromEnv(c.env);
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session) throw new ApiError(401, "unauthorized");

      const db = createDbFromEnv(c.env);
      const staff = await platformStaffRepository.findByUserId(
        db,
        session.user.id
      );
      if (!staff) throw new ApiError(403, "forbidden");

      c.set("platformStaffId", staff.id);
      c.set("platformStaffRole", staff.role);
      role = staff.role;
    }

    if (!satisfies(role, minRole)) {
      throw new ApiError(403, "insufficient_platform_role");
    }
    await next();
  });
