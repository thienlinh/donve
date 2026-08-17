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
