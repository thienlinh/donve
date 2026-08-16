import { and, eq } from "drizzle-orm";
import type { AnyPgColumn, AnyPgTable } from "drizzle-orm/pg-core";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";

type OrgScopedTable = AnyPgTable & { id: AnyPgColumn; orgId: AnyPgColumn };

/**
 * Base CRUD every org-scoped table gets for free. Every method takes `orgId` and every
 * query runs inside `withOrgScope` — there is no way to call this without scoping
 * (NFR-04 / architecture.md §6). Domain repositories wrap this and add bespoke queries.
 */
export function createOrgScopedRepository<TTable extends OrgScopedTable>(
  table: TTable
) {
  type Row = TTable["$inferSelect"];
  type Insert = TTable["$inferInsert"];
  // Drizzle's `.from()`/`.update()` overloads can't resolve their data-modifying-subquery
  // check against a generic TTable, so they need a concrete AnyPgTable at the call site.
  // `table` itself keeps the precise TTable type everywhere else (column refs, $inferSelect).
  const anyTable = table as AnyPgTable;

  return {
    async findById(db: Db, orgId: string, id: string) {
      const rows = await withOrgScope<Row[]>(db, orgId, (qb) =>
        qb
          .select()
          .from(anyTable)
          .where(and(eq(table.orgId, orgId), eq(table.id, id)))
          .limit(1)
      );
      return rows[0];
    },

    async list(db: Db, orgId: string) {
      return withOrgScope<Row[]>(db, orgId, (qb) =>
        qb.select().from(anyTable).where(eq(table.orgId, orgId))
      );
    },

    async insert(db: Db, orgId: string, values: Omit<Insert, "orgId">) {
      const rows = await withOrgScope<Row[]>(db, orgId, (qb) =>
        qb
          .insert(table)
          .values({ ...values, orgId } as Insert)
          .returning()
      );
      return rows[0];
    },

    async update(
      db: Db,
      orgId: string,
      id: string,
      values: Omit<Partial<Insert>, "id" | "orgId">
    ) {
      const rows = await withOrgScope<Row[]>(db, orgId, (qb) =>
        qb
          .update(anyTable)
          .set(values)
          .where(and(eq(table.orgId, orgId), eq(table.id, id)))
          .returning()
      );
      return rows[0];
    },
  };
}
