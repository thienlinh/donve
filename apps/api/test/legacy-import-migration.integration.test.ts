import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  customPageBundlesRepository,
  landingPagesRepository,
  pageVersionsRepository,
  schema
} from "@dv/db";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer
} from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { afterAll, beforeAll, expect, it } from "vitest";

import { createDbFromEnv } from "../src/lib/db.js";
import { runLegacyImportMigration } from "../src/lib/legacy-import-migration.js";
import { createStorageFromEnv } from "../src/lib/storage.js";
import type { Bindings } from "../src/types.js";

/**
 * `roadmap/roadmap.md` §Migration dữ liệu cũ — "Landing page tạo trước bản thiết kế này tự
 * động coi là custom_import". Verifies the real qualifying condition (spec IS NULL, not
 * already custom_import) end-to-end against real Postgres + local-fs storage, and that it's
 * idempotent (running twice never double-migrates or errors).
 */
let container: StartedPostgreSqlContainer;
let bindings: Bindings;
let storageDir: string;

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:18-alpine").start();
  const connectionUri = container.getConnectionUri();

  const migratorClient = postgres(connectionUri, { max: 1 });
  const rawDb = drizzle(migratorClient, { schema });
  await migrate(rawDb, {
    migrationsFolder: fileURLToPath(
      new URL("../../../packages/db/migrations", import.meta.url)
    ).replaceAll("\\", "/")
  });
  await migratorClient.end();

  storageDir = mkdtempSync(path.join(tmpdir(), "dv-legacy-migration-test-"));

  bindings = {
    UPSTASH_REDIS_URL: "unused",
    UPSTASH_REDIS_TOKEN: "unused",
    DATABASE_URL: connectionUri,
    BETTER_AUTH_SECRET: "test-secret-at-least-32-chars-long!!",
    BETTER_AUTH_URL: "http://localhost:3000",
    DASHBOARD_URL: "http://localhost:5173",
    RESEND_API_KEY: "test-key",
    RUNTIME: "bun",
    PUBLISH_BASE_DOMAIN: "test.local",
    LOCAL_STORAGE_DIR: storageDir
  } as Bindings;
}, 60_000);

afterAll(async () => {
  await container.stop();
  rmSync(storageDir, { recursive: true, force: true });
});

it("flips a legacy (spec-less) page to custom_import and backfills its bundle, idempotently", async () => {
  const db = createDbFromEnv(bindings);
  const storage = createStorageFromEnv(bindings);
  const orgId = crypto.randomUUID();

  const legacyPage = await landingPagesRepository.insert(db, orgId, {
    name: "Old srcmap page",
    campaignId: null,
    source: "import"
  });
  if (!legacyPage) throw new Error("landing page insert failed");

  const htmlKey = `landing-pages/${legacyPage.id}/v1/index.html`;
  await storage.put({
    key: htmlKey,
    body: '<html><body><form><input name="phone"/></form></body></html>',
    contentType: "text/html"
  });
  const legacyVersion = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: legacyPage.id,
    seq: 1,
    htmlKey,
    srcmapKey: `${htmlKey}.srcmap.json`,
    spec: null,
    origin: "import",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null
  });
  if (!legacyVersion) throw new Error("page version insert failed");
  await landingPagesRepository.update(db, orgId, legacyPage.id, {
    currentVersionId: legacyVersion.id
  });

  // A native page (spec set) must never be touched by this migration.
  const nativePage = await landingPagesRepository.insert(db, orgId, {
    name: "Native page",
    campaignId: null,
    source: "manual"
  });
  if (!nativePage) throw new Error("landing page insert failed");
  const nativeVersion = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: nativePage.id,
    seq: 1,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: { pageSpec: { root: "page-root", elements: {} }, tokens: {} }
  });
  if (!nativeVersion) throw new Error("page version insert failed");
  await landingPagesRepository.update(db, orgId, nativePage.id, {
    currentVersionId: nativeVersion.id
  });

  const firstRun = await runLegacyImportMigration(bindings);
  expect(firstRun.migrated).toBe(1);

  const migratedLegacy = await landingPagesRepository.findById(
    db,
    orgId,
    legacyPage.id
  );
  expect(migratedLegacy?.source).toBe("custom_import");

  const untouchedNative = await landingPagesRepository.findById(
    db,
    orgId,
    nativePage.id
  );
  expect(untouchedNative?.source).toBe("manual");

  const bundle = await customPageBundlesRepository.findByLandingPage(
    db,
    orgId,
    legacyPage.id
  );
  expect(bundle?.sourceKind).toBe("paste_html");
  expect(bundle?.detectedForms).toEqual([
    { selector: "import-form-0", wired: false }
  ]);

  const secondRun = await runLegacyImportMigration(bindings);
  expect(secondRun.migrated).toBe(0);
});
