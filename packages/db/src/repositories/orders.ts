import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { orders } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(orders);

export const ordersRepository = {
  ...base,

  async findByCode(db: Db, orgId: string, code: string) {
    const rows = await withOrgScope<(typeof orders.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(orders)
          .where(and(eq(orders.orgId, orgId), eq(orders.code, code)))
          .limit(1)
    );
    return rows[0];
  }
};
