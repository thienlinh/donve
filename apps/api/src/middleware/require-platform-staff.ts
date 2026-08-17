import { platformStaffRepository } from "@dv/db";
import { createMiddleware } from "hono/factory";

import { createAuthFromEnv } from "../lib/auth.js";
import { createDbFromEnv } from "../lib/db.js";
import { ApiError } from "../lib/errors.js";
import type { AppEnv } from "../types.js";

/**
 * Gate for every `/platform/*` route (docs/architecture/platform-admin.md §4) — separate from
 * tenant auth entirely. A valid session alone isn't enough: the session's user must also have
 * a row in `platform_staff` (granted by hand, see platform-admin.md §6 — no self-serve signup).
 */
export const requirePlatformStaff = createMiddleware<AppEnv>(
  async (c, next) => {
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
    await next();
  }
);
