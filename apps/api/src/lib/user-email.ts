import { membershipsRepository, schema, type Db } from "@dv/db";
import { eq } from "drizzle-orm";

/** Shared by every job that emails a specific user (lead-digest, notify-manager) — `user.email`
 * isn't org-scoped (auth's own table, not a CRM one), so this is a plain lookup, not a
 * repository method on an org-scoped table. */
export async function resolveUserEmail(
  db: Db,
  userId: string
): Promise<string | null> {
  const rows = await db.raw
    .select({ email: schema.user.email })
    .from(schema.user)
    .where(eq(schema.user.id, userId))
    .limit(1);
  return rows[0]?.email ?? null;
}

/** The org's owner — used as the "manager" fallback target (unassigned leads, notify_manager
 * SLA breaches) since there's no separate "manager" role in the membership model. */
export async function resolveOwnerEmail(
  db: Db,
  orgId: string
): Promise<string | null> {
  const [owner] = await membershipsRepository.listByRole(db, orgId, "owner");
  return owner ? resolveUserEmail(db, owner.userId) : null;
}
