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
 * Read-only counterpart to `withOrgScope` (docs/architecture/platform-admin.md §3) — sets
 * `app.is_platform_admin` instead of `app.current_org`, which only `platformReadPolicy`
 * (schema/rls.ts) checks. That policy is `for: "select"` only, so this helper must never be
 * used for writes: there is no RLS policy that lets an INSERT/UPDATE/DELETE through on this
 * flag alone. Writing on behalf of a tenant still goes through `withOrgScope(targetOrgId, ...)`.
 *
 * Same two-driver split as `withOrgScope` (see that file's comment for the full reasoning):
 * postgres-js gets a real transaction, neon-http must ship `set_config` and the query in one
 * `.batch()` call since it has no real `.transaction()`.
 */
export async function withPlatformScope<T>(
  db: Db,
  build: (qb: QueryBuilder) => unknown
): Promise<T> {
  if (db.kind === "postgres-js") {
    return db.raw.transaction(async (tx) => {
      await tx.execute(
        sql`select set_config('app.is_platform_admin', 'true', true)`
      );
      // oxlint-disable-next-line no-unsafe-type-assertion
      return (await build(tx)) as T;
    });
  }

  const setFlag = db.raw.execute(
    sql`select set_config('app.is_platform_admin', 'true', true)`
  );
  const query = build(db.raw);
  // oxlint-disable-next-line no-unsafe-type-assertion
  const results: readonly unknown[] = await db.raw.batch([
    setFlag,
    query
  ] as Parameters<typeof db.raw.batch>[0]);
  // oxlint-disable-next-line no-unsafe-type-assertion
  return results[1] as T;
}
