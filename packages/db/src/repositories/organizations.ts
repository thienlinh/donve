import { eq, getTableColumns, sql } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { user } from "../schema/auth.js";
import { memberships, organizations } from "../schema/core.js";

/**
 * Organizations are the tenant boundary itself, so most of this repo's `orgId`
 * contract doesn't apply here: creation happens before any org exists, and reads
 * are scoped by the org's own id rather than a separate caller-supplied orgId.
 * RLS isn't enabled on `organizations` for the same reason (architecture.md §6
 * only lists tables that hold tenant *data*, not the tenant record itself).
 */
export const organizationsRepository = {
  async create(db: Db, values: typeof organizations.$inferInsert) {
    const rows = await db.raw.insert(organizations).values(values).returning();
    return rows[0];
  },

  /**
   * Cross-tenant by definition — only for `/platform/*` routes (platform-admin.md §7). The
   * owner's email comes along because support's entry point is almost always "this person
   * emailed us" (platform-admin.md §11 "search theo tên/email owner"), and it isn't reachable
   * from the org row alone. Left join: an org whose owner membership was deleted still lists.
   */
  listAll(db: Db) {
    const owner = db.raw
      .select({
        orgId: memberships.orgId,
        email: sql<string>`min(${user.email})`.as("email")
      })
      .from(memberships)
      .innerJoin(user, eq(user.id, memberships.userId))
      .where(eq(memberships.role, "owner"))
      .groupBy(memberships.orgId)
      .as("owner");

    return db.raw
      .select({
        // Spread rather than `.select()` so the extra column can ride along.
        ...getTableColumns(organizations),
        ownerEmail: owner.email
      })
      .from(organizations)
      .leftJoin(owner, eq(owner.orgId, organizations.id));
  },

  async findById(db: Db, orgId: string) {
    const rows = await db.raw
      .select()
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1);
    return rows[0];
  },

  async findBySlug(db: Db, slug: string) {
    const rows = await db.raw
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1);
    return rows[0];
  },

  /**
   * Counts for the platform org-detail screen (platform-admin.md §11 "tab Overview"). One
   * query with scalar subselects rather than four round trips — `withOrgScope` only allows a
   * single statement on the neon-http driver anyway (see org-scope.ts). Scoped by the target
   * org like any tenant read: `leads` has RLS, the other three don't, and this stays correct
   * either way.
   */
  async statsForOrg(db: Db, orgId: string) {
    const rows = await withOrgScope<
      {
        memberCount: number;
        campaignCount: number;
        leadCount: number;
        aiCreditSpent: number;
      }[]
    >(db, orgId, (qb) =>
      qb
        .select({
          memberCount: sql<number>`(select count(*) from memberships where org_id = ${orgId})::int`,
          campaignCount: sql<number>`(select count(*) from campaigns where org_id = ${orgId} and deleted_at is null)::int`,
          leadCount: sql<number>`(select count(*) from leads where org_id = ${orgId} and deleted_at is null)::int`,
          aiCreditSpent: sql<number>`(select coalesce(sum(credit_cost), 0) from ai_usage where org_id = ${orgId})::int`
        })
        // `organizations` is just the single-row anchor this needs a FROM for — every real
        // number above comes from the subselects.
        .from(organizations)
        .where(eq(organizations.id, orgId))
    );
    return (
      rows[0] ?? {
        memberCount: 0,
        campaignCount: 0,
        leadCount: 0,
        aiCreditSpent: 0
      }
    );
  },

  async update(
    db: Db,
    orgId: string,
    values: Partial<typeof organizations.$inferInsert>
  ) {
    const rows = await db.raw
      .update(organizations)
      .set(values)
      .where(eq(organizations.id, orgId))
      .returning();
    return rows[0];
  }
};
