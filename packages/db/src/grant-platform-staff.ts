import { eq } from "drizzle-orm";

import { createPostgresDb } from "./client/postgres-js.js";
import { platformStaffRepository } from "./repositories/platform-staff.js";
import { user } from "./schema/auth.js";

/**
 * One-off CLI grant (docs/architecture/platform-admin.md §6) — no self-serve signup, no UI,
 * by design: `bun run grant-platform-staff <email>`. Looks up by email instead of requiring
 * the caller to already know the user's ULID.
 */
async function main() {
  const email = process.argv[2];
  if (!email) throw new Error("usage: grant-platform-staff <email>");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");

  const db = createPostgresDb(databaseUrl);

  const rows = await db.raw
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  const found = rows[0];
  if (!found) throw new Error(`no user with email ${email}`);

  const existing = await platformStaffRepository.findByUserId(db, found.id);
  if (existing) {
    console.log(`${email} is already platform staff (role=${existing.role})`);
    return;
  }

  const staff = await platformStaffRepository.grant(
    db,
    found.id,
    "platform_admin"
  );
  console.log(`granted platform_admin to ${email} (staff id ${staff?.id})`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
