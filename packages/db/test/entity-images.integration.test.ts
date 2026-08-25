import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer
} from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { ulid } from "ulid";
import { afterAll, beforeAll, expect, it } from "vitest";

import { createPostgresDb } from "../src/client/postgres-js.js";
import { entityImagesRepository } from "../src/repositories/entity-images.js";
import * as schema from "../src/schema/index.js";

let container: StartedPostgreSqlContainer;
let db: ReturnType<typeof createPostgresDb>;

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:17-alpine").start();
  const connectionUri = container.getConnectionUri();
  const migratorClient = postgres(connectionUri, { max: 1 });
  await migrate(drizzle(migratorClient, { schema }), {
    migrationsFolder: new URL("../migrations", import.meta.url).pathname
  });
  await migratorClient.end();
  db = createPostgresDb(connectionUri);
}, 60_000);

afterAll(async () => {
  await container.stop();
});

it("keeps exactly one image per (owner, kind) — a re-upload overwrites instead of duplicating", async () => {
  const orgId = ulid();
  const campaignId = ulid();
  const logo = {
    ownerType: "organization",
    ownerId: orgId,
    kind: "logo"
  } as const;

  await entityImagesRepository.upsert(db, orgId, {
    ...logo,
    r2Key: "entity-images/a/logo",
    mime: "image/webp"
  });
  const replaced = await entityImagesRepository.upsert(db, orgId, {
    ...logo,
    r2Key: "entity-images/b/logo",
    mime: "image/png"
  });
  expect(replaced?.r2Key).toBe("entity-images/b/logo");
  expect((await entityImagesRepository.findByRef(db, orgId, logo))?.mime).toBe(
    "image/png"
  );

  // Same org, different owner type/kind — the unique index must not collapse these into one row.
  await entityImagesRepository.upsert(db, orgId, {
    ownerType: "campaign",
    ownerId: campaignId,
    kind: "og_image",
    r2Key: "entity-images/c/og",
    mime: "image/webp"
  });
  expect(
    await entityImagesRepository.findByRef(db, orgId, {
      ownerType: "campaign",
      ownerId: campaignId,
      kind: "og_image"
    })
  ).toBeDefined();
  expect(
    await entityImagesRepository.findByRef(db, orgId, {
      ownerType: "campaign",
      ownerId: campaignId,
      kind: "logo"
    })
  ).toBeUndefined();

  await entityImagesRepository.removeByRef(db, orgId, logo);
  expect(
    await entityImagesRepository.findByRef(db, orgId, logo)
  ).toBeUndefined();
});
