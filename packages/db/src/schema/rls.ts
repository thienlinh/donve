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

/**
 * Read access for tables where `org_id IS NULL` marks a platform-curated row visible to
 * every tenant (e.g. platform skills/prompt templates — see `skillsRepository`'s `ownedBy`).
 * Paired with `orgIsolationPolicy()` on the same table: that policy alone would hide NULL
 * rows from everyone (`org_id = current_org` is never true when `org_id IS NULL`), and still
 * fully governs INSERT/UPDATE/DELETE since this policy is `for: "select"` only — a tenant
 * session can never write a NULL-org row through it.
 */
export const orgOrPlatformReadPolicy = () =>
  pgPolicy("org_or_platform_read", {
    for: "select",
    using: sql`org_id = current_setting('app.current_org', true) OR org_id IS NULL`
  });
