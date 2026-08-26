import { sql } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import type { Db, Schema } from "./client/types.js";

type PostgresJsTx = Parameters<
  PostgresJsDatabase<Schema>["transaction"]
>[0] extends (tx: infer TX, ...rest: never[]) => unknown
  ? TX
  : never;

type QueryBuilder = NeonHttpDatabase<Schema> | PostgresJsTx;

/**
 * Every repository query MUST go through this helper (NFR-04 / architecture.md §6.1) —
 * it is the only place allowed to run `set_config('app.current_org', ...)`.
 *
 * The two drivers this platform runs on set the org scope differently:
 * - postgres-js (Bun/VPS): a real transaction, so `set_config` and the real query run
 *   as ordinary sequential statements inside the same session.
 * - neon-http (CF Workers): the driver has no real `.transaction()` (throws if called) —
 *   only `.batch()`, which ships every statement in one HTTP round trip that Postgres
 *   executes atomically. `set_config` and the query MUST be in the same `.batch()` call;
 *   two separate `.execute()`/query calls are two separate round trips and the `SET LOCAL`
 *   silently stops applying to the second one. That's why `build` must return an
 *   *unexecuted* query builder rather than something already awaited — it still needs to
 *   be handed to `.batch()` as one array, not run on its own.
 *
 * Because of that, `build` may only issue a single query for the neon-http path. Multi-statement
 * flows (advisory-lock seq allocation, atomic credit debit) need a dedicated helper, not this one.
 */
export async function withOrgScope<T>(
  db: Db,
  orgId: string,
  build: (qb: QueryBuilder) => unknown
): Promise<T> {
  if (db.kind === "postgres-js") {
    return db.raw.transaction(async (tx) => {
      await tx.execute(
        sql`select set_config('app.current_org', ${orgId}, true)`
      );
      // build()'s row shape is erased to `unknown` on purpose so both driver branches share
      // one signature; the caller recovers it via withOrgScope<T>()'s explicit type parameter.
      // oxlint-disable-next-line no-unsafe-type-assertion
      return (await build(tx)) as T;
    });
  }

  const setOrgScope = db.raw.execute(
    sql`select set_config('app.current_org', ${orgId}, true)`
  );
  const query = build(db.raw);
  // batch() wants a concrete tuple of RunnableQuery; `query` is a query builder shaped like
  // one but typed `unknown` above, so the cast just re-asserts what build() actually returns.
  // oxlint-disable-next-line no-unsafe-type-assertion
  const results: readonly unknown[] = await db.raw.batch([
    setOrgScope,
    query
  ] as Parameters<typeof db.raw.batch>[0]);
  // oxlint-disable-next-line no-unsafe-type-assertion -- same erased-shape reason as above.
  return results[1] as T;
}

/**
 * Multi-statement counterpart to `withOrgScope` — for flows that need more than one query
 * under the same org scope (e.g. a delete+insert "replace" pair), which plain `withOrgScope`
 * can't express since the neon-http path only ever batches exactly one query alongside
 * `set_config`. `build` returns every statement to run; all of them see the same org scope.
 */
export async function withOrgScopeMulti(
  db: Db,
  orgId: string,
  build: (qb: QueryBuilder) => unknown[]
): Promise<void> {
  if (db.kind === "postgres-js") {
    await db.raw.transaction(async (tx) => {
      await tx.execute(
        sql`select set_config('app.current_org', ${orgId}, true)`
      );
      for (const statement of build(tx)) {
        // Statements must run in the caller's order (e.g. delete before insert in a "replace"
        // pair); Promise.all would race them instead.
        // oxlint-disable-next-line no-await-in-loop, react-doctor/async-await-in-loop
        await statement;
      }
    });
    return;
  }

  const setOrgScope = db.raw.execute(
    sql`select set_config('app.current_org', ${orgId}, true)`
  );
  const statements = build(db.raw);
  // oxlint-disable-next-line no-unsafe-type-assertion -- same erased-shape reason as withOrgScope.
  await db.raw.batch([setOrgScope, ...statements] as Parameters<
    typeof db.raw.batch
  >[0]);
}
