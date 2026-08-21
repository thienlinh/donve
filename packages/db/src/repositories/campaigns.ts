import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { ulid } from "ulid";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { campaigns } from "../schema/catalog.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

/** `campaigns.publicId` — a human-readable slug (unlike the ULID `id`), for future public URLs. */
export function generateCampaignPublicId(name: string): string {
  const slug =
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // strip Vietnamese diacritics (post-NFD)
      .replace(/đ/g, "d") // đ (not decomposed by NFD)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "campaign";
  return `${slug}-${ulid().slice(-6).toLowerCase()}`;
}

const base = createOrgScopedRepository(campaigns);

export const campaignsRepository = {
  ...base,

  /** Paginated, non-deleted campaigns — used by `GET /api/campaigns` (FR-C list, avoids loading
   * the whole org table like the old unbounded `list()` did). */
  async listPage(db: Db, orgId: string, page: number, pageSize: number) {
    const where = and(eq(campaigns.orgId, orgId), isNull(campaigns.deletedAt));
    const [rows, countRows] = await Promise.all([
      withOrgScope<(typeof campaigns.$inferSelect)[]>(db, orgId, (qb) =>
        qb
          .select()
          .from(campaigns)
          .where(where)
          .orderBy(desc(campaigns.createdAt))
          .limit(pageSize)
          .offset((page - 1) * pageSize)
      ),
      withOrgScope<{ count: number }[]>(db, orgId, (qb) =>
        qb
          .select({ count: sql<number>`count(*)::int` })
          .from(campaigns)
          .where(where)
      )
    ]);
    return { rows, total: countRows[0]?.count ?? 0 };
  },

  async findByPublicId(db: Db, orgId: string, publicId: string) {
    const rows = await withOrgScope<(typeof campaigns.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(campaigns)
          .where(
            and(
              eq(campaigns.orgId, orgId),
              eq(campaigns.publicId, publicId),
              isNull(campaigns.deletedAt)
            )
          )
          .limit(1)
    );
    return rows[0];
  }
};
