import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  auditRunsRepository,
  landingPagesRepository,
  pageVersionsRepository,
  schema
} from "@dv/db";
import {
  pageSpecToPuckData,
  puckDataToPageSpec,
  type DesignTokens
} from "@dv/studio-catalog";
import type { Spec } from "@json-render/core";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer
} from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { afterAll, beforeAll, expect, it } from "vitest";

import { createDbFromEnv } from "../src/lib/db.js";
import { publishLandingPage } from "../src/lib/publish.js";
import type { Bindings } from "../src/types.js";

/**
 * End-to-end for roadmap.md §Publish-time SSR renderer's "Điều kiện xong": 1 hand-written
 * PageSpec publishes through the exact same R2/outbox/KV pipeline as the legacy srcmap flow
 * (`publishLandingPage` branches on `pageVersions.spec`, apps/api/src/lib/publish.ts) — no
 * separate pipeline for native pages. Runs against a real Postgres (testcontainers) and the
 * local-fs storage/cache drivers `RUNTIME: "bun"` falls back to (docker-compose's Redis must
 * be running locally — same requirement as the other `*.integration.test.ts` files here).
 */

let container: StartedPostgreSqlContainer;
let bindings: Bindings;
let deploymentsDir: string;

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

  deploymentsDir = mkdtempSync(path.join(tmpdir(), "dv-publish-test-"));

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
    LOCAL_DEPLOYMENTS_DIR: deploymentsDir
  } as Bindings;
}, 60_000);

afterAll(async () => {
  await container.stop();
  rmSync(deploymentsDir, { recursive: true, force: true });
});

it("publishes a hand-written native PageSpec through the shared R2/outbox/KV pipeline", async () => {
  const db = createDbFromEnv(bindings);
  const orgId = crypto.randomUUID();

  const landingPage = await landingPagesRepository.insert(db, orgId, {
    name: "Native test page",
    campaignId: null,
    source: "manual"
  });
  if (!landingPage) throw new Error("landing page insert failed");

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    seq: 1,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: {
      pageSpec: {
        root: "page-root",
        elements: {
          "page-root": {
            type: "page_root",
            props: {},
            children: ["hero-1"]
          },
          "hero-1": {
            type: "hero",
            props: {
              headline: "Native publish integration test",
              subheadline: "PageSpec → R2/outbox/KV",
              ctaLabel: "Go",
              ctaHref: "/signup",
              image: { src: "https://example.com/hero.jpg", alt: "demo" },
              variant: "saas"
            },
            children: []
          }
        }
      },
      tokens,
      seo: { description: "Integration test page" }
    }
  });
  if (!version) throw new Error("page version insert failed");

  await landingPagesRepository.update(db, orgId, landingPage.id, {
    currentVersionId: version.id
  });

  // publishLandingPage gates native pages on a passing audit for the exact current version
  // (quality-spec.md §Launch threshold) — insert one directly rather than through the real
  // (LLM-calling) POST /:id/audit route, same reasoning as landing the pageVersion above
  // instead of going through the AI generation routes.
  await auditRunsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    pageVersionId: version.id,
    overallScore: 95,
    categoryScores: {
      strategy_alignment: 100,
      messaging_copy: 100,
      page_structure: 100,
      seo: 100,
      performance: 100,
      tracking_completeness: 100,
      token_consistency: 100,
      visual_regression: 100
    }
  });

  const subdomain = `native-test-${crypto.randomUUID().slice(0, 8)}`;
  const { deployment, live } = await publishLandingPage(
    db,
    bindings,
    orgId,
    landingPage.id,
    subdomain
  );

  expect(live).toBe(true);
  expect(deployment.status).toBe("live");

  const html = readFileSync(
    path.join(deploymentsDir, deployment.r2Prefix, "index.html"),
    "utf8"
  );
  expect(html).toContain("Native publish integration test");
  expect(html).toContain('data-lp-component="hero"');
  expect(html).toContain('rel="canonical"');
});

/**
 * Studio-native's canvas/layers/inspector is now Puck (`@puckeditor/core`) instead of the old
 * hand-built panels — but PageSpec stays the canonical, DB-persisted shape (`puck-adapter.ts`'s
 * header comment): the dashboard only ever converts PageSpec ⇄ Puck's own `Data` shape at the
 * UI edge, round-tripping back to plain PageSpec before it's ever saved. This proves that round
 * trip end to end: a PageSpec edited "through Puck" (simulated here, since there's no browser)
 * publishes through the exact same pipeline with identical output — no Puck-only artifact
 * (its own CSS classes, `data-puck`/`_Puck` attributes, or an injected `id` prop) leaks into the
 * published HTML.
 */
it("publishes a PageSpec that was round-tripped through the Puck adapter, with no Puck artifacts in the output", async () => {
  const db = createDbFromEnv(bindings);
  const orgId = crypto.randomUUID();

  const landingPage = await landingPagesRepository.insert(db, orgId, {
    name: "Puck round-trip test page",
    campaignId: null,
    source: "manual"
  });
  if (!landingPage) throw new Error("landing page insert failed");

  const originalSpec: Spec = {
    root: "page-root",
    elements: {
      "page-root": {
        type: "page_root",
        props: {},
        children: ["hero-1"]
      },
      "hero-1": {
        type: "hero",
        props: {
          headline: "Puck round-trip publish test",
          subheadline: "PageSpec -> Puck Data -> PageSpec -> publish",
          ctaLabel: "Go",
          ctaHref: "/signup",
          image: { src: "https://example.com/hero.jpg", alt: "demo" },
          variant: "saas"
        },
        children: []
      }
    }
  };

  // Simulates what the dashboard does on load (`pageSpecToPuckData`) and on every edit
  // (`puckDataToPageSpec`) — no browser/Puck runtime involved, just the same pure adapter
  // functions the Studio page calls.
  const puckData = pageSpecToPuckData(originalSpec);
  const roundTrippedSpec = puckDataToPageSpec(puckData, originalSpec);

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    seq: 1,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: {
      pageSpec: roundTrippedSpec,
      tokens,
      seo: { description: "Puck round-trip integration test" }
    }
  });
  if (!version) throw new Error("page version insert failed");

  await landingPagesRepository.update(db, orgId, landingPage.id, {
    currentVersionId: version.id
  });

  await auditRunsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    pageVersionId: version.id,
    overallScore: 95,
    categoryScores: {
      strategy_alignment: 100,
      messaging_copy: 100,
      page_structure: 100,
      seo: 100,
      performance: 100,
      tracking_completeness: 100,
      token_consistency: 100,
      visual_regression: 100
    }
  });

  const subdomain = `puck-roundtrip-test-${crypto.randomUUID().slice(0, 8)}`;
  const { deployment, live } = await publishLandingPage(
    db,
    bindings,
    orgId,
    landingPage.id,
    subdomain
  );

  expect(live).toBe(true);
  expect(deployment.status).toBe("live");

  const html = readFileSync(
    path.join(deploymentsDir, deployment.r2Prefix, "index.html"),
    "utf8"
  );

  expect(html).toContain("Puck round-trip publish test");
  expect(html).toContain('data-lp-component="hero"');
  expect(html).toContain('rel="canonical"');

  // No Puck editor chrome/CSS/attributes ever reach published output, and the `id` Puck
  // injects into `props` for its own drag-drop key (stripped by `puckDataToPageSpec`) never
  // leaks through as a component prop either.
  expect(html).not.toContain("data-puck");
  expect(html).not.toContain("_Puck");
  expect(html).not.toContain("puck.css");
  expect(roundTrippedSpec.elements["hero-1"]?.props).not.toHaveProperty("id");
});

/**
 * Studio SEO tab (`architecture-and-data-model.md` §Publish · Domain · SEO): `seo.title`
 * overrides the rendered `<title>`/`og:title` (the page name is only the fallback) and
 * `seo.noindex` both tags the document and ships a deployment-local robots.txt/sitemap.xml
 * for edge-router to serve instead of its generated, indexable default.
 */
it("applies seo.title and seo.noindex to the published artifacts", async () => {
  const db = createDbFromEnv(bindings);
  const orgId = crypto.randomUUID();

  const landingPage = await landingPagesRepository.insert(db, orgId, {
    name: "Page name that must not win",
    campaignId: null,
    source: "manual"
  });
  if (!landingPage) throw new Error("landing page insert failed");

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    seq: 1,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: {
      pageSpec: {
        root: "page-root",
        elements: {
          "page-root": { type: "page_root", props: {}, children: [] }
        }
      },
      tokens,
      seo: {
        title: "SEO title wins",
        description: "SEO tab integration test",
        noindex: true
      }
    }
  });
  if (!version) throw new Error("page version insert failed");

  await landingPagesRepository.update(db, orgId, landingPage.id, {
    currentVersionId: version.id
  });
  await auditRunsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    pageVersionId: version.id,
    overallScore: 95,
    categoryScores: {
      strategy_alignment: 100,
      messaging_copy: 100,
      page_structure: 100,
      seo: 100,
      performance: 100,
      tracking_completeness: 100,
      token_consistency: 100,
      visual_regression: 100
    }
  });

  const { deployment } = await publishLandingPage(
    db,
    bindings,
    orgId,
    landingPage.id,
    `seo-test-${crypto.randomUUID().slice(0, 8)}`
  );

  const deployDir = path.join(deploymentsDir, deployment.r2Prefix);
  const html = readFileSync(path.join(deployDir, "index.html"), "utf8");

  expect(html).toContain("<title>SEO title wins</title>");
  expect(html).not.toContain("Page name that must not win");
  expect(html).toContain('name="robots" content="noindex"');
  expect(readFileSync(path.join(deployDir, "robots.txt"), "utf8")).toContain(
    "Disallow: /"
  );
  expect(
    readFileSync(path.join(deployDir, "sitemap.xml"), "utf8")
  ).not.toContain("<loc>");
});
