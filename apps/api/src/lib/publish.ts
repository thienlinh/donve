import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  campaignsRepository,
  customDomainsRepository,
  deploymentsRepository,
  landingPagesRepository,
  pageAssetsRepository,
  pageVersionsRepository,
  productsRepository,
  publishOutboxRepository,
  type Db
} from "@dv/db";
import { cache, storage } from "@dv/drivers";
import {
  buildPublishArtifacts,
  type PublishStructuredData
} from "@dv/studio-core/publish";

import type { Bindings } from "../types.js";
import { createDbFromEnv } from "./db.js";
import { ApiError } from "./errors.js";
import { log } from "./logger.js";
import { createStorageFromEnv } from "./storage.js";

export interface HostnamePointer {
  deployId: string;
  orgId: string;
  campaignId: string | null;
}

interface HostnamePointerStore {
  get(hostname: string): Promise<HostnamePointer | null>;
  set(hostname: string, pointer: HostnamePointer): Promise<void>;
  delete(hostname: string): Promise<void>;
}

/**
 * The "KV" side of the outbox pattern (architecture.md §5.2) — hostname -> deployment
 * pointer, read by apps/edge-router at serve time. CF Workers gets the real `HOSTNAME_KV`
 * binding; Bun/VPS (which doesn't run edge-router at all) reuses the already-wired Upstash
 * cache driver as an equivalent durable key/value store instead of standing up a redundant
 * one — same driver-per-runtime convention as `lib/db.ts`/`lib/storage.ts`.
 */
function createHostnamePointerStore(env: Bindings): HostnamePointerStore {
  if (env.RUNTIME === "workers") {
    if (!env.HOSTNAME_KV) {
      throw new ApiError(
        501,
        "kv_unavailable",
        "HOSTNAME_KV binding is missing"
      );
    }
    const kv = env.HOSTNAME_KV;
    return {
      async get(hostname) {
        const raw = await kv.get(hostname);
        return raw ? (JSON.parse(raw) as HostnamePointer) : null;
      },
      async set(hostname, pointer) {
        await kv.put(hostname, JSON.stringify(pointer));
      },
      async delete(hostname) {
        await kv.delete(hostname);
      }
    };
  }

  if (!env.UPSTASH_REDIS_URL || !env.UPSTASH_REDIS_TOKEN) {
    throw new ApiError(
      501,
      "kv_unavailable",
      "UPSTASH_REDIS_URL/UPSTASH_REDIS_TOKEN are required as the hostname-pointer store on the Bun runtime"
    );
  }
  const driver = cache.createUpstashCacheDriver({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN
  });
  return {
    get: (hostname) => driver.get<HostnamePointer>(hostname),
    set: (hostname, pointer) => driver.set(hostname, pointer),
    delete: (hostname) => driver.delete(hostname)
  };
}

/**
 * Deployment output bypasses `createStorageFromEnv` on purpose (architecture.md §3 "phạm vi
 * portable" — `StorageDriver`/R2 is for studio draft assets, deployment output is a separate,
 * Cloudflare-specific bucket read directly by apps/edge-router). Bun/VPS has no edge-router
 * counterpart to read it back, so it gets the same local-fs driver studio drafts use, just a
 * different directory.
 */
function createDeploymentStorage(env: Bindings) {
  if (env.RUNTIME === "workers") {
    if (!env.DEPLOYMENTS_BUCKET) {
      throw new ApiError(
        501,
        "storage_unavailable",
        "DEPLOYMENTS_BUCKET binding is missing"
      );
    }
    return storage.createR2StorageDriver(env.DEPLOYMENTS_BUCKET);
  }
  return storage.createLocalFsStorageDriver(
    env.LOCAL_DEPLOYMENTS_DIR ?? ".data/deployments"
  );
}

/** Fixed key the compiled runtime bundle is uploaded to on CF Workers deploys — see the
 * "Upload runtime script to R2" step in .github/workflows/deploy-{staging,prod}.yml. */
const RUNTIME_SCRIPT_KEY = "_runtime/index.iife.js";

let cachedRuntimeScript: { bytes: Uint8Array; mime: string } | null | undefined;

/**
 * Reads apps/landing-runtime's compiled IIFE bundle (tsdown, tech-stack.md). On Bun/VPS this
 * is a real filesystem read (the monorepo checkout is present at runtime). CF Workers has no
 * filesystem at request time, so there the bundle is instead read back from `DEPLOYMENTS_BUCKET`
 * under `RUNTIME_SCRIPT_KEY` — uploaded there by a deploy-time step, using the same R2 storage
 * driver `createDeploymentStorage` already wires up for published-landing output. Either path
 * converges on the same `{ bytes, mime }` shape before being handed to `buildPublishArtifacts`.
 */
async function readRuntimeScript(
  env: Bindings
): Promise<{ bytes: Uint8Array; mime: string } | null> {
  if (cachedRuntimeScript !== undefined) return cachedRuntimeScript;

  if (env.RUNTIME === "workers") {
    try {
      const deployStorage = createDeploymentStorage(env);
      const object = await deployStorage.get(RUNTIME_SCRIPT_KEY);
      if (!object) {
        log("warn", {
          requestId: "publish",
          orgId: null,
          message:
            "landing-runtime bundle not found in DEPLOYMENTS_BUCKET, publishing without it",
          error: RUNTIME_SCRIPT_KEY
        });
        cachedRuntimeScript = null;
        return cachedRuntimeScript;
      }
      cachedRuntimeScript = {
        bytes: new Uint8Array(await new Response(object.body).arrayBuffer()),
        mime: "application/javascript"
      };
    } catch (err) {
      log("warn", {
        requestId: "publish",
        orgId: null,
        message: "landing-runtime bundle unavailable, publishing without it",
        error: err instanceof Error ? err.message : String(err)
      });
      cachedRuntimeScript = null;
    }
    return cachedRuntimeScript;
  }

  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const bundlePath = path.join(
      here,
      "../../../landing-runtime/dist/index.iife.js"
    );
    cachedRuntimeScript = {
      bytes: readFileSync(bundlePath),
      mime: "application/javascript"
    };
  } catch (err) {
    log("warn", {
      requestId: "publish",
      orgId: null,
      message: "landing-runtime bundle unavailable, publishing without it",
      error: err instanceof Error ? err.message : String(err)
    });
    cachedRuntimeScript = null;
  }
  return cachedRuntimeScript;
}

export function hostnameFor(env: Bindings, subdomain: string): string {
  return `${subdomain}.${env.PUBLISH_BASE_DOMAIN}`;
}

/** FR-G-05 og:image — reads the landing page's already-captured `.thumbnail.jpg`, if any. */
async function resolveOgImage(
  draftStorage: ReturnType<typeof createStorageFromEnv>,
  thumbnailKey: string | null
): Promise<{ bytes: Uint8Array; mime: string } | undefined> {
  if (!thumbnailKey) return undefined;
  const object = await draftStorage.get(thumbnailKey);
  if (!object) return undefined;
  return {
    bytes: new Uint8Array(await new Response(object.body).arrayBuffer()),
    mime: object.contentType ?? "image/jpeg"
  };
}

/**
 * FR-G-05 JSON-LD — resolves all of the campaign's linked products/courses to build
 * Product/Course schemas instead of the generic WebPage fallback. A landing page can only
 * be linked to one campaign, but a campaign may have several products; buildPublishArtifacts
 * emits one per product (wrapped in an ItemList when there's more than one).
 */
async function resolveStructuredData(
  db: Db,
  orgId: string,
  campaignId: string | null
): Promise<PublishStructuredData[] | undefined> {
  if (!campaignId) return undefined;
  const campaign = await campaignsRepository.findById(db, orgId, campaignId);
  if (!campaign) return undefined;
  const products = await productsRepository.listForCampaign(
    db,
    orgId,
    campaignId
  );
  if (products.length === 0) return undefined;
  return products.map((product) => ({
    type: product.type === "course" ? "Course" : "Product",
    name: product.name,
    description: product.description ?? undefined,
    price: product.type === "course" ? undefined : product.price
  }));
}

type DeploymentRow = NonNullable<
  Awaited<ReturnType<typeof deploymentsRepository.findById>>
>;
type OutboxRow = NonNullable<
  Awaited<ReturnType<typeof publishOutboxRepository.findById>>
>;

interface PublishResult {
  deployment: DeploymentRow;
  live: boolean;
}

/** Runs the whole build_deploy pipeline for one landing page (architecture.md §5.2). */
export async function publishLandingPage(
  db: Db,
  env: Bindings,
  orgId: string,
  landingPageId: string,
  subdomain: string
): Promise<PublishResult> {
  const landingPage = await landingPagesRepository.findById(
    db,
    orgId,
    landingPageId
  );
  if (!landingPage || landingPage.deletedAt || !landingPage.currentVersionId) {
    throw new ApiError(404, "landing_page_not_found");
  }
  const currentVersionId = landingPage.currentVersionId;

  const draftStorage = createStorageFromEnv(env);
  const [{ versionId, html }, assetRows] = await Promise.all([
    (async () => {
      const version = await pageVersionsRepository.findById(
        db,
        orgId,
        currentVersionId
      );
      if (!version) throw new ApiError(404, "page_version_not_found");
      const object = await draftStorage.get(version.htmlKey);
      if (!object) throw new ApiError(404, "html_not_found");
      return {
        versionId: version.id,
        html: await new Response(object.body).text()
      };
    })(),
    pageAssetsRepository.listByLandingPage(db, orgId, landingPageId)
  ]);

  // FR-B-35: an import-flagged asset (unverifiedSource) blocks publish until the tenant ticks
  // "Tôi có quyền sử dụng ảnh này" (landings/routes.ts PATCH .../assets/:assetId) — the
  // platform only warns, the tenant takes on copyright responsibility by confirming.
  const unconfirmed = assetRows.filter(
    (asset) => asset.unverifiedSource && !asset.usageConfirmed
  );
  if (unconfirmed.length > 0) {
    throw new ApiError(409, "unverified_assets_pending_confirmation");
  }

  const assets = await Promise.all(
    assetRows.map(async (asset) => {
      const object = await draftStorage.get(asset.r2Key);
      if (!object) throw new ApiError(404, "asset_not_found", asset.r2Key);
      const bytes = new Uint8Array(
        await new Response(object.body).arrayBuffer()
      );
      return {
        originalUrl: `/api/landings/${landingPageId}/assets/${asset.id}/file`,
        bytes,
        mime: asset.mime
      };
    })
  );

  const hostname = hostnameFor(env, subdomain);

  // FR-G-01: reject a subdomain another org already has live/building — the reserved-word
  // and format checks in @dv/contracts don't catch cross-org duplicate claims, and
  // publishOutboxRepository.markApplied would otherwise silently supersede the other org's
  // live deployment on the same hostname.
  const activeClaims = await deploymentsRepository.findActiveByHostname(
    db,
    hostname
  );
  if (activeClaims.some((claim) => claim.orgId !== orgId)) {
    throw new ApiError(409, "subdomain_taken");
  }

  const deployment = await deploymentsRepository.insert(db, orgId, {
    landingPageId,
    pageVersionId: versionId,
    hostname,
    status: "building",
    r2Prefix: "", // filled in right below, once the deployment id (part of the prefix) exists
    meta: {}
  });
  if (!deployment) throw new ApiError(500, "deployment_create_failed");
  const r2Prefix = `deployments/${deployment.id}`;
  await deploymentsRepository.update(db, orgId, deployment.id, { r2Prefix });

  const [ogImage, structuredData] = await Promise.all([
    resolveOgImage(draftStorage, landingPage.thumbnailKey),
    resolveStructuredData(db, orgId, landingPage.campaignId)
  ]);

  const deployStorage = createDeploymentStorage(env);
  try {
    const artifacts = await buildPublishArtifacts({
      html,
      assets,
      hostname,
      title: landingPage.name,
      ogImage,
      structuredData,
      runtimeConfig: {
        orgId,
        campaignId: landingPage.campaignId,
        deployId: deployment.id,
        // FR-D-01/03: the embedded runtime script's own public API origin + Turnstile site
        // key — both were previously never injected, so a published landing's form could
        // never actually reach `/public/leads` nor produce a valid Turnstile token.
        apiUrl: env.BETTER_AUTH_URL,
        turnstileSiteKey: env.TURNSTILE_SITE_KEY
      },
      runtimeScript: (await readRuntimeScript(env)) ?? undefined
    });

    await deployStorage.put({
      key: `${r2Prefix}/index.html`,
      body: artifacts.html,
      contentType: "text/html"
    });
    await Promise.all(
      artifacts.assets.map((asset) =>
        deployStorage.put({
          key: `${r2Prefix}/${asset.key}`,
          body: asset.bytes,
          contentType: asset.mime
        })
      )
    );
    const sizeBytes =
      artifacts.html.length +
      artifacts.assets.reduce((sum, asset) => sum + asset.bytes.byteLength, 0);
    await deploymentsRepository.update(db, orgId, deployment.id, {
      meta: { sizeBytes }
    });
  } catch (err) {
    await deploymentsRepository.update(db, orgId, deployment.id, {
      status: "failed"
    });
    throw err;
  }

  const outboxRow = await publishOutboxRepository.insert(db, orgId, {
    deploymentId: deployment.id,
    hostname,
    targetDeployId: deployment.id,
    status: "pending",
    appliedAt: null
  });
  if (!outboxRow) throw new ApiError(500, "outbox_create_failed");

  const live = await applyOutboxEntry(db, env, outboxRow);

  if (live) {
    await syncCustomDomainsForLandingPage(db, env, orgId, landingPageId);
    // Best-effort cache warm (architecture.md §5.2) — never fails the publish call.
    // ponytail: server-side thumbnail capture (browser rendering) stays unimplemented —
    // FR-G-01's thumbnail is already captured client-side after every save
    // (landings/routes.ts `/:id/thumbnail`), so publish doesn't need its own capture path
    // yet. Add one here (Workers Browser Rendering) if a fresh post-publish shot becomes
    // a real requirement.
    fetch(`https://${hostname}/`).catch((err: unknown) => {
      log("warn", {
        requestId: "publish",
        orgId,
        message: "cache warm fetch failed",
        error: err instanceof Error ? err.message : String(err)
      });
    });
  }

  const updated = await deploymentsRepository.findById(
    db,
    orgId,
    deployment.id
  );
  if (!updated) throw new ApiError(500, "deployment_create_failed");
  return { deployment: updated, live };
}

/**
 * Applies one outbox row: pointer-store put, then the outbox+deployment status flip
 * (architecture.md §5.2: "KV xác nhận thành công thì set deployments.status=live VÀ
 * publish_outbox.status=applied trong cùng bước"). Returns whether it actually went live —
 * `false` means it's left `pending`/`failed` for reconciliation to retry, not that the
 * caller's request failed.
 */
export async function applyOutboxEntry(
  db: Db,
  env: Bindings,
  outboxRow: OutboxRow
): Promise<boolean> {
  try {
    const pointerStore = createHostnamePointerStore(env);
    await pointerStore.set(outboxRow.hostname, {
      deployId: outboxRow.targetDeployId,
      orgId: outboxRow.orgId,
      campaignId: null
    });
    await publishOutboxRepository.markApplied(db, outboxRow);
    return true;
  } catch (err) {
    log("warn", {
      requestId: "publish",
      orgId: outboxRow.orgId,
      message: "outbox apply failed, left pending for reconciliation",
      outboxId: outboxRow.id,
      error: err instanceof Error ? err.message : String(err)
    });
    await publishOutboxRepository.markFailed(db, outboxRow.id);
    return false;
  }
}

/**
 * FR-G-04 — points one custom domain's hostname at whatever deployment is currently live for
 * its landing page, or clears the pointer if that page has since been unpublished. Sits
 * outside the outbox pattern entirely (a custom domain isn't a `deployments` row, just an
 * alternate hostname pointed at the same deploy output) — called right after a subdomain
 * publish/rollback goes live, and again by `reconcilePublishState` to catch drift the same
 * way it already does for subdomains.
 *
 * Best-effort like `applyOutboxEntry`'s pointer-store write: a transient KV failure here must
 * not fail the publish/rollback/unpublish call that already committed successfully — it's
 * swallowed (and logged) so `reconcilePublishState`'s drift-fix pass can retry it instead.
 */
export async function syncCustomDomainPointer(
  db: Db,
  env: Bindings,
  customDomain: { orgId: string; hostname: string; landingPageId: string }
): Promise<void> {
  try {
    const pointerStore = createHostnamePointerStore(env);
    const [allDeployments, landingPage] = await Promise.all([
      deploymentsRepository.list(db, customDomain.orgId),
      landingPagesRepository.findById(
        db,
        customDomain.orgId,
        customDomain.landingPageId
      )
    ]);
    const live = allDeployments.find(
      (d) =>
        d.landingPageId === customDomain.landingPageId && d.status === "live"
    );
    if (!live) {
      await pointerStore.delete(customDomain.hostname);
      return;
    }
    await pointerStore.set(customDomain.hostname, {
      deployId: live.id,
      orgId: customDomain.orgId,
      campaignId: landingPage?.campaignId ?? null
    });
  } catch (err) {
    log("warn", {
      requestId: "publish",
      orgId: customDomain.orgId,
      message: "custom domain pointer sync failed, left for reconciliation",
      hostname: customDomain.hostname,
      error: err instanceof Error ? err.message : String(err)
    });
  }
}

/** FR-G-04 — drops a custom domain's pointer-store entry outright, e.g. when the domain is
 * removed from the org entirely (not just its landing page going unpublished). */
export async function clearCustomDomainPointer(
  env: Bindings,
  hostname: string
): Promise<void> {
  await createHostnamePointerStore(env).delete(hostname);
}

/** Re-syncs every active custom domain attached to one landing page — called after that
 * page's own subdomain publish/rollback/unpublish changes what's live. */
async function syncCustomDomainsForLandingPage(
  db: Db,
  env: Bindings,
  orgId: string,
  landingPageId: string
): Promise<void> {
  const domains = await customDomainsRepository.list(db, orgId);
  await Promise.all(
    domains
      .filter((d) => d.landingPageId === landingPageId && d.status === "active")
      .map((d) => syncCustomDomainPointer(db, env, d))
  );
}

/**
 * Rollback goes through the same outbox mechanism as publish (architecture.md §5.2) — a new
 * outbox row pointing the hostname back at an already-built, older deployment.
 */
export async function rollbackDeployment(
  db: Db,
  env: Bindings,
  orgId: string,
  landingPageId: string,
  targetDeploymentId: string
): Promise<boolean> {
  const target = await deploymentsRepository.findById(
    db,
    orgId,
    targetDeploymentId
  );
  if (!target || target.landingPageId !== landingPageId) {
    throw new ApiError(404, "deployment_not_found");
  }
  if (target.status !== "live" && target.status !== "superseded") {
    throw new ApiError(409, "deployment_not_rollbackable");
  }

  const outboxRow = await publishOutboxRepository.insert(db, orgId, {
    deploymentId: target.id,
    hostname: target.hostname,
    targetDeployId: target.id,
    status: "pending",
    appliedAt: null
  });
  if (!outboxRow) throw new ApiError(500, "outbox_create_failed");

  const live = await applyOutboxEntry(db, env, outboxRow);
  if (live) {
    await syncCustomDomainsForLandingPage(db, env, orgId, landingPageId);
  }
  return live;
}

/**
 * Unpublish takes the hostname pointer away entirely rather than pointing it at another
 * deployment, so it doesn't fit the outbox's "targetDeployId" shape (FR-G-02) — there's no
 * `deployments.status=live` to flip via `markApplied`. Deletes the pointer-store entry
 * directly, then marks the deployment `unpublished`; a later publish/rollback creates a fresh
 * outbox row same as always.
 */
export async function unpublishLandingPage(
  db: Db,
  env: Bindings,
  orgId: string,
  landingPageId: string
): Promise<DeploymentRow> {
  const all = await deploymentsRepository.list(db, orgId);
  const live = all.find(
    (deployment) =>
      deployment.landingPageId === landingPageId && deployment.status === "live"
  );
  if (!live) throw new ApiError(409, "not_published");

  const pointerStore = createHostnamePointerStore(env);
  await pointerStore.delete(live.hostname);

  const updated = await deploymentsRepository.update(db, orgId, live.id, {
    status: "unpublished"
  });
  if (!updated) throw new ApiError(500, "unpublish_failed");
  await syncCustomDomainsForLandingPage(db, env, orgId, landingPageId);
  return updated;
}

/**
 * Periodic reconciliation (architecture.md §5.2) — retries any outbox row that never got
 * applied (job crashed between R2 upload and the pointer-store put), and separately catches
 * drift where Postgres says a hostname is `live` but the pointer store disagrees or is
 * missing entirely. Runs across every org: a system job, not a tenant request, so it reads
 * via the cross-org repository methods instead of `withOrgScope`
 * (packages/db/src/repositories/publish-outbox.ts, deployments.ts).
 */
export async function reconcilePublishState(
  env: Bindings
): Promise<{ retried: number; driftFixed: number }> {
  const db = createDbFromEnv(env);
  const pending = await publishOutboxRepository.listPendingAcrossOrgs(db);
  const applied = await Promise.all(
    pending.map((outboxRow) => applyOutboxEntry(db, env, outboxRow))
  );
  const retried = applied.filter(Boolean).length;

  const pointerStore = createHostnamePointerStore(env);
  const [liveDeployments, activeCustomDomains] = await Promise.all([
    deploymentsRepository.listLiveAcrossOrgs(db),
    customDomainsRepository.listActiveAcrossOrgs(db)
  ]);
  const [fixed, customDomainsFixed] = await Promise.all([
    Promise.all(
      liveDeployments.map(async (deployment) => {
        const pointer = await pointerStore.get(deployment.hostname);
        if (pointer?.deployId === deployment.id) return false;
        log("warn", {
          requestId: "reconcile",
          orgId: deployment.orgId,
          message: "hostname pointer drift detected, re-applying",
          hostname: deployment.hostname,
          expectedDeployId: deployment.id,
          actualDeployId: pointer?.deployId ?? null
        });
        await pointerStore.set(deployment.hostname, {
          deployId: deployment.id,
          orgId: deployment.orgId,
          campaignId: null
        });
        return true;
      })
    ),
    // FR-G-04 — same drift check as above, but for active custom domains: their pointer isn't
    // covered by the outbox at all (syncCustomDomainPointer runs best-effort right after a
    // publish/rollback/unpublish), so this is the only backstop if that best-effort call failed.
    Promise.all(
      activeCustomDomains.map(async (customDomain) => {
        const [pointer, expected] = await Promise.all([
          pointerStore.get(customDomain.hostname),
          deploymentsRepository.list(db, customDomain.orgId)
        ]);
        const expectedLive = expected.find(
          (d) =>
            d.landingPageId === customDomain.landingPageId &&
            d.status === "live"
        );
        if (pointer?.deployId === (expectedLive?.id ?? null)) return false;
        await syncCustomDomainPointer(db, env, customDomain);
        return true;
      })
    )
  ]);

  return {
    retried,
    driftFixed:
      fixed.filter(Boolean).length + customDomainsFixed.filter(Boolean).length
  };
}
