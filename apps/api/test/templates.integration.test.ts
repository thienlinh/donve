import { fileURLToPath } from "node:url";

import {
  landingPagesRepository,
  pageVersionsRepository,
  schema,
  templatesRepository
} from "@dv/db";
import type { DesignTokens } from "@dv/studio-catalog";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer
} from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { ulid } from "ulid";
import { afterAll, beforeAll, expect, it } from "vitest";

import { createDbFromEnv } from "../src/lib/db.js";
import type { Bindings } from "../src/types.js";

/**
 * `templates` has no `org_id`/RLS (`packages/db/src/schema/templates.ts`) — shared across every
 * org. This verifies the round trip `POST /:id/save-as-template` and `POST /manual` (with
 * `templateId`) rely on: a native page's `pageSpec`/`tokens`/`seo`/`architectureNotes` clone
 * into a `templates` row losslessly, and a fresh landing page cloned from that template starts
 * with identical content (structural equivalent of what the routes do, at the repository level —
 * same level `publish-native.integration.test.ts` tests `publishLandingPage` at).
 */

let container: StartedPostgreSqlContainer;
let bindings: Bindings;

const tokens: DesignTokens = {
  colorPrimary: "#2563eb",
  colorPrimaryForeground: "#ffffff",
  colorSurface: "#ffffff",
  colorForeground: "#111827",
  colorMuted: "#6b7280",
  colorBorder: "#e5e7eb",
  fontHeading: "Inter",
  fontBody: "Inter",
  radius: "0.5rem"
};

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:17-alpine").start();
  const connectionUri = container.getConnectionUri();

  const migratorClient = postgres(connectionUri, { max: 1 });
  const rawDb = drizzle(migratorClient, { schema });
  await migrate(rawDb, {
    migrationsFolder: fileURLToPath(
      new URL("../../../packages/db/migrations", import.meta.url)
    ).replaceAll("\\", "/")
  });
  await migratorClient.end();

  bindings = {
    UPSTASH_REDIS_URL: "unused",
    UPSTASH_REDIS_TOKEN: "unused",
    DATABASE_URL: connectionUri,
    BETTER_AUTH_SECRET: "test-secret-at-least-32-chars-long!!",
    BETTER_AUTH_URL: "http://localhost:3000",
    DASHBOARD_URL: "http://localhost:5173",
    RESEND_API_KEY: "test-key",
    RUNTIME: "bun"
  } as Bindings;
}, 60_000);

afterAll(async () => {
  await container.stop();
});

it("promotes a native page's current version into `templates`, then clones it losslessly into a new page", async () => {
  const db = createDbFromEnv(bindings);
  const orgId = ulid();

  const sourcePageSpec = {
    root: "page-root",
    elements: {
      "page-root": { type: "page_root", props: {}, children: ["hero-1"] },
      "hero-1": {
        type: "hero",
        props: {
          headline: "Template source page",
          subheadline: "Save-as-template integration test",
          ctaLabel: "Go",
          ctaHref: "/signup",
          image: { src: "https://example.com/hero.jpg", alt: "demo" },
          variant: "saas"
        },
        children: []
      }
    }
  };
  const architectureNotes = {
    "hero-1": { purpose: "understanding", reason: "Above the fold" }
  };

  const sourcePage = await landingPagesRepository.insert(db, orgId, {
    name: "Template source",
    campaignId: null,
    source: "manual"
  });
  if (!sourcePage) throw new Error("landing page insert failed");

  const sourceVersion = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: sourcePage.id,
    seq: 1,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: {
      pageSpec: sourcePageSpec,
      tokens,
      seo: { description: "Template source" },
      architectureNotes
    }
  });
  if (!sourceVersion) throw new Error("page version insert failed");

  // Equivalent of what `POST /:id/save-as-template` does: read the current version's `spec`
  // and clone its fields into a `templates` row.
  const template = await templatesRepository.insert(db, {
    name: "SaaS starter",
    industry: "SaaS",
    thumbnailKey: null,
    pageSpec: sourcePageSpec,
    tokens,
    seo: { description: "Template source" },
    architectureNotes
  });
  if (!template) throw new Error("template insert failed");

  expect(template.pageSpec).toEqual(sourcePageSpec);
  expect(template.architectureNotes).toEqual(architectureNotes);

  const listed = await templatesRepository.list(db);
  expect(listed.map((t) => t.id)).toContain(template.id);

  const fetched = await templatesRepository.findById(db, template.id);
  expect(fetched?.pageSpec).toEqual(sourcePageSpec);

  // Equivalent of what `POST /manual` with `templateId` does: clone the template's fields into
  // a fresh landing page's first version.
  const clonedPage = await landingPagesRepository.insert(db, orgId, {
    name: "Cloned from template",
    campaignId: null,
    source: "manual"
  });
  if (!clonedPage) throw new Error("cloned landing page insert failed");

  const clonedVersion = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: clonedPage.id,
    seq: 1,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: {
      pageSpec: fetched!.pageSpec,
      tokens: fetched!.tokens,
      seo: fetched!.seo ?? undefined,
      architectureNotes: fetched!.architectureNotes ?? undefined
    }
  });

  expect(clonedVersion?.spec).toEqual({
    pageSpec: sourcePageSpec,
    tokens,
    seo: { description: "Template source" },
    architectureNotes
  });
});
