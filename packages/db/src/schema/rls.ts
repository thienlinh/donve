import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";

/**
 * Row-level security policy shared by every sensitive table (architecture.md §6/§6.1).
 * `current_setting(..., true)` returns NULL when unset, so the comparison — and thus
 * the policy — fails closed instead of leaking rows when app.current_org was never set.
 */
export const orgIsolationPolicy = () =>
  pgPolicy("org_isolation", {
    for: "all",
    using: sql`org_id = current_setting('app.current_org', true)`,
    withCheck: sql`org_id = current_setting('app.current_org', true)`
  });

/**
 * Cross-tenant read access for platform staff (docs/architecture/platform-admin.md §2).
 * Deliberately `for: "select"` only — Postgres ORs multiple permissive policies together,
 * so this adds a read path across every org without touching INSERT/UPDATE/DELETE, which
 * still only ever pass through `orgIsolationPolicy`'s `app.current_org` check. Writing on
 * behalf of a tenant must still go through `withOrgScope(targetOrgId, ...)` like any other
 * write — there is no "write as platform admin" bypass.
 */
export const platformReadPolicy = () =>
  pgPolicy("platform_read", {
    for: "select",
    using: sql`current_setting('app.is_platform_admin', true) = 'true'`
  });
