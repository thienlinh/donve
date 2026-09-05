import { createAuth } from "@dv/auth";
import {
  createPostgresDb,
  membershipsRepository,
  organizationsRepository,
  platformStaffRepository,
  schema
} from "@dv/db";
import { eq } from "drizzle-orm";

/**
 * Local-dev-only test fixtures: one account per platform-staff role plus one
 * account per org-membership role across a few orgs, so every role in the
 * RBAC model (packages/auth/src/permissions.ts, packages/db/src/schema/platform.ts)
 * has a real, loggable-in account. Not for prod — hardcoded shared password.
 */
const TEST_PASSWORD = "Password123!";

const PLATFORM_ACCOUNTS = [
  {
    email: "platform-admin@donve.test",
    name: "Platform Admin",
    role: "platform_admin" as const
  },
  {
    email: "platform-billing@donve.test",
    name: "Platform Billing Ops",
    role: "billing_ops" as const
  },
  {
    email: "platform-support@donve.test",
    name: "Platform Support",
    role: "support" as const
  }
];

const ORG_ROLES = ["owner", "admin", "editor", "sales"] as const;

const ORGS = [
  { name: "Acme Ads", slug: "acme-ads", plan: "free" as const },
  { name: "Beta Media", slug: "beta-media", plan: "starter" as const },
  { name: "Gamma Retail", slug: "gamma-retail", plan: "pro" as const }
];

const SOLO_USER = { email: "solo-user@donve.test", name: "Solo User (no org)" };

function requiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is required to seed accounts`);
  return value;
}

async function main() {
  const databaseUrl = requiredEnv("DATABASE_URL");
  const db = createPostgresDb(databaseUrl);
  const auth = createAuth({
    db: db.raw,
    baseURL: requiredEnv("BETTER_AUTH_URL"),
    secret: requiredEnv("BETTER_AUTH_SECRET"),
    trustedOrigins: [requiredEnv("APP_URL")]
  });

  // No email sender is passed to `createAuth` here, so verify/reset emails are
  // a no-op — mark every seeded account verified directly so sign-in works right away.
  async function ensureUser(email: string, name: string) {
    const existing = await db.raw
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1);
    if (existing[0]) return existing[0];

    const result = await auth.api.signUpEmail({
      body: { email, password: TEST_PASSWORD, name }
    });
    await db.raw
      .update(schema.user)
      .set({ emailVerified: true })
      .where(eq(schema.user.id, result.user.id));
    return { ...result.user, emailVerified: true };
  }

  await Promise.all(
    PLATFORM_ACCOUNTS.map(async (account) => {
      const created = await ensureUser(account.email, account.name);
      const existingStaff = await platformStaffRepository.findByUserId(
        db,
        created.id
      );
      if (!existingStaff) {
        await platformStaffRepository.grant(db, created.id, account.role);
      }
      console.log(`platform staff: ${account.email} (${account.role})`);
    })
  );

  await ensureUser(SOLO_USER.email, SOLO_USER.name);
  console.log(`solo user (no org membership): ${SOLO_USER.email}`);

  await Promise.all(
    ORGS.map(async (orgDef) => {
      let org = await organizationsRepository.findBySlug(db, orgDef.slug);
      if (!org) {
        org = await organizationsRepository.create(db, {
          name: orgDef.name,
          slug: orgDef.slug,
          plan: orgDef.plan
        });
      }
      if (!org) throw new Error(`failed to create org ${orgDef.slug}`);
      const resolvedOrg = org;

      await Promise.all(
        ORG_ROLES.map(async (role) => {
          const email = `${role}@${orgDef.slug}.test`;
          const created = await ensureUser(email, `${orgDef.name} ${role}`);
          const existingMembership = await membershipsRepository.findByUserId(
            db,
            resolvedOrg.id,
            created.id
          );
          if (!existingMembership) {
            await membershipsRepository.insert(db, resolvedOrg.id, {
              userId: created.id,
              role
            });
          }
          console.log(`org "${orgDef.slug}": ${email} (${role})`);
        })
      );
    })
  );

  console.log(`\nAll seeded accounts use password: ${TEST_PASSWORD}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
