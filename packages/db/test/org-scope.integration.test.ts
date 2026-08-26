import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer
} from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createPostgresDb } from "../src/client/postgres-js.js";
import { leadsRepository } from "../src/repositories/leads.js";
import { ordersRepository } from "../src/repositories/orders.js";
import { organizations } from "../src/schema/core.js";
import { leads } from "../src/schema/crm.js";
import * as schema from "../src/schema/index.js";

/**
 * Proves architecture.md §6/§6.1 for real: two fake orgs, seeded through the actual
 * repository layer, queried under the wrong org — and asserts Postgres itself (not app
 * code) is what blocks the leak.
 *
 * Two non-superuser roles are set up on purpose, because there are two distinct ways
 * RLS can be silently defeated and each needs its own role to catch:
 * - APP_ROLE: a least-privilege role that does NOT own the tables (the "careful setup").
 *   Table owners bypass RLS by default, so testing under a role that owns the tables
 *   would pass even if the policies were never applied — this rules that out.
 * - OWNER_ROLE: a non-superuser role that migrates AND owns every table (the common
 *   "one Postgres role for everything" setup — e.g. a single default project role).
 *   Ownership alone would bypass RLS here too; only migrations/0001_force_row_level_security.sql
 *   (`FORCE ROW LEVEL SECURITY`) closes that gap, so this role is what proves it works.
 * The container's own bootstrap role is deliberately never queried against — it's a
 * Postgres superuser, and superusers bypass RLS unconditionally regardless of FORCE.
 * The equivalent real-world rule is operational: never grant the app's runtime role
 * SUPERUSER or BYPASSRLS.
 */
const APP_ROLE = "app_user";
const APP_PASSWORD = "app_password";
const OWNER_ROLE = "app_owner";
const OWNER_PASSWORD = "app_owner_password";

let container: StartedPostgreSqlContainer;
let appDb: ReturnType<typeof createPostgresDb>;
/** Non-superuser role that ran migrations, so it owns every table — see block comment above. */
let ownerDb: ReturnType<typeof drizzle>;
let orgA: typeof organizations.$inferSelect;
let orgB: typeof organizations.$inferSelect;

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:18-alpine").start();
  const adminUrl = container.getConnectionUri();

  // CREATE ROLE requires CREATEROLE/superuser, so both roles are created here via the
  // container's bootstrap (superuser) connection; everything else runs as one of the two.
  const bootstrapClient = postgres(adminUrl, { max: 1 });
  await bootstrapClient.unsafe(
    `CREATE ROLE ${OWNER_ROLE} LOGIN PASSWORD '${OWNER_PASSWORD}'`
  );
  await bootstrapClient.unsafe(`GRANT ALL ON SCHEMA public TO ${OWNER_ROLE}`);
  // migrate() also needs to create its own `drizzle` migrations-tracking schema.
  await bootstrapClient.unsafe(
    `GRANT CREATE ON DATABASE ${container.getDatabase()} TO ${OWNER_ROLE}`
  );
  await bootstrapClient.unsafe(
    `CREATE ROLE ${APP_ROLE} LOGIN PASSWORD '${APP_PASSWORD}'`
  );
  await bootstrapClient.unsafe(`GRANT USAGE ON SCHEMA public TO ${APP_ROLE}`);
  await bootstrapClient.end();

  const ownerUrl = new URL(adminUrl);
  ownerUrl.username = OWNER_ROLE;
  ownerUrl.password = OWNER_PASSWORD;
  const ownerClient = postgres(ownerUrl.toString(), { max: 1 });
  ownerDb = drizzle(ownerClient, { schema });
  // OWNER_ROLE creates every table by running the migration itself, so it becomes the owner.
  await migrate(ownerDb, { migrationsFolder: "./migrations" });

  // Granting on tables just created requires being their owner (or superuser) — OWNER_ROLE
  // qualifies since it's the one that ran the migration above.
  await ownerClient.unsafe(
    `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${APP_ROLE}`
  );

  const seededOrgs = await ownerDb
    .insert(organizations)
    .values([
      { name: "Org A", slug: "org-a" },
      { name: "Org B", slug: "org-b" }
    ])
    .returning();
  const [seededA, seededB] = seededOrgs;
  if (!seededA || !seededB) throw new Error("failed to seed orgs");
  orgA = seededA;
  orgB = seededB;

  const appUrl = new URL(adminUrl);
  appUrl.username = APP_ROLE;
  appUrl.password = APP_PASSWORD;
  appDb = createPostgresDb(appUrl.toString());
}, 60_000);

afterAll(async () => {
  await container.stop();
});

describe("withOrgScope + RLS org isolation, exercised through the repository layer", () => {
  it("keeps org A's leads invisible to org B, and visible to org A", async () => {
    const lead = await leadsRepository.insert(appDb, orgA.id, {
      campaignId: crypto.randomUUID(),
      fullName: "Nguyen Van A",
      phone: "+84900000001"
    });
    expect(lead?.orgId).toBe(orgA.id);

    const asOrgA = await leadsRepository.list(appDb, orgA.id);
    expect(asOrgA.map((row) => row.id)).toContain(lead?.id);

    const asOrgB = await leadsRepository.list(appDb, orgB.id);
    expect(asOrgB).toHaveLength(0);
  });

  it("keeps org A's orders invisible to org B", async () => {
    await ordersRepository.insert(appDb, orgA.id, {
      code: "DVTEST1",
      leadId: crypto.randomUUID(),
      campaignId: crypto.randomUUID(),
      amount: "100000"
    });

    const asOrgB = await ordersRepository.list(appDb, orgB.id);
    expect(asOrgB).toHaveLength(0);

    const asOrgA = await ordersRepository.list(appDb, orgA.id);
    expect(asOrgA.length).toBeGreaterThan(0);
  });

  it("fails closed even with no org context set at all — this is RLS, not app-layer filtering", async () => {
    // Bypasses withOrgScope entirely, simulating the exact bug §6.1 defends against:
    // app code that forgot to filter by org_id. Two orgs' leads already exist from the
    // test above, so a naive/forgotten query would leak both if RLS weren't enforcing.
    const rows = await appDb.raw.select().from(leads);
    expect(rows).toHaveLength(0);
  });

  it("still fails closed even when queried as the table OWNER — regression guard for FORCE ROW LEVEL SECURITY", async () => {
    // OWNER_ROLE both ran the migration and owns every table (the common "one role for
    // everything" setup). Without migrations/0001_force_row_level_security.sql this query
    // — no org context set — would return both orgs' leads instead of zero, because
    // Postgres exempts table owners from their own RLS policies unless FORCE is set too.
    const rows = await ownerDb.select().from(leads);
    expect(rows).toHaveLength(0);
  });
});
