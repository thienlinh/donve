import { and, desc, eq, isNull, sql } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { campaignProducts, products } from "../schema/catalog.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(products);

export const productsRepository = {
  ...base,

  /** Paginated, non-deleted products — used by `GET /api/products` (avoids loading the whole
   * org table like the old unbounded `list()` did). */
  async listPage(db: Db, orgId: string, page: number, pageSize: number) {
    const where = and(eq(products.orgId, orgId), isNull(products.deletedAt));
    const [rows, countRows] = await Promise.all([
      withOrgScope<(typeof products.$inferSelect)[]>(db, orgId, (qb) =>
        qb
          .select()
          .from(products)
          .where(where)
          .orderBy(desc(products.createdAt))
          .limit(pageSize)
          .offset((page - 1) * pageSize)
      ),
      withOrgScope<{ count: number }[]>(db, orgId, (qb) =>
        qb
          .select({ count: sql<number>`count(*)::int` })
          .from(products)
          .where(where)
      )
    ]);
    return { rows, total: countRows[0]?.count ?? 0 };
  },

  /** Products linked to a campaign, for FR-G-05's JSON-LD Product/Course builder. */
  async listForCampaign(db: Db, orgId: string, campaignId: string) {
    return withOrgScope<(typeof products.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select({
          id: products.id,
          orgId: products.orgId,
          type: products.type,
          name: products.name,
          price: products.price,
          description: products.description,
          images: products.images,
          attributes: products.attributes,
          isActive: products.isActive,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          deletedAt: products.deletedAt
        })
        .from(products)
        .innerJoin(
          campaignProducts,
          eq(campaignProducts.productId, products.id)
        )
        .where(
          and(
            eq(products.orgId, orgId),
            eq(campaignProducts.campaignId, campaignId)
          )
        )
        // deterministic order — callers (e.g. public/leads' paid-product pick) need a stable
        // "first" product, not whatever order Postgres happens to return.
        .orderBy(products.createdAt)
    );
  }
};
