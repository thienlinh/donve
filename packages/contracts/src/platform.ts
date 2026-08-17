import { z } from "zod";

import { ulidSchema } from "./common.js";

/** Mirrors `platform_staff.role` (packages/db/src/schema/platform.ts) — one role for now,
 * see docs/architecture/platform-admin.md §0 for why more roles are a non-goal until needed. */
export const platformStaffRoleValues = ["platform_admin"] as const;
export const platformStaffRoleSchema = z.enum(platformStaffRoleValues);
export type PlatformStaffRole = z.infer<typeof platformStaffRoleSchema>;

/** Response shape of `GET /platform/whoami` (apps/api/src/modules/platform/routes.ts). */
export const platformWhoAmISchema = z.object({
  staffId: ulidSchema,
  role: platformStaffRoleSchema
});
export type PlatformWhoAmI = z.infer<typeof platformWhoAmISchema>;
