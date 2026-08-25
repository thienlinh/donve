import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  auditResultSchema,
  nativePageDocumentSchema,
  passesLaunchThreshold
} from "@dv/contracts";
import {
  auditFindingsRepository,
  auditRunsRepository,
  campaignsRepository,
  customDomainsRepository,
  deploymentsRepository,
  entityImagesRepository,
  landingPagesRepository,
  pageAssetsRepository,
  pageVersionsRepository,
  productsRepository,
  publishOutboxRepository,
  type Db
} from "@dv/db";
import { storage } from "@dv/drivers";
import {
  buildPublishArtifacts,
  type PublishPipelineInput,
  type PublishPipelineOutput,
  type PublishStructuredData
} from "@dv/studio-core/publish";
import { renderPageArtifact } from "@dv/studio-render";
import type { Spec } from "@json-render/core";

import type { Bindings } from "../types.js";
import { createCacheFromEnv } from "./cache.js";
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
 * binding; Bun/VPS (which doesn't run edge-router at all) reuses `createCacheFromEnv`'s
 * plain-Redis driver as an equivalent durable key/value store instead of standing up a
 * redundant one — same driver-per-runtime convention as `lib/db.ts`/`lib/storage.ts`.
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

  const driver = createCacheFromEnv(env);
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

/** Draft-storage prefix a pre-publish preview's artifacts live under, and the public route
 * that serves them back (`modules/public/routes.ts`) — the two have to agree, so they're
 * declared together here rather than duplicated at each end. */
export const PREVIEW_KEY_PREFIX = "previews";
export const PREVIEW_BASE_PATH = "/public/preview";

export function hostnameFor(env: Bindings, subdomain: string): string {
  return `${subdomain}.${env.PUBLISH_BASE_DOMAIN}`;
}

type OgImage = { bytes: Uint8Array; mime: string };

async function readStorageImage(
  draftStorage: ReturnType<typeof createStorageFromEnv>,
  key: string,
  fallbackMime: string
): Promise<OgImage | undefined> {
  const object = await draftStorage.get(key);
  if (!object) return undefined;
  return {
    bytes: new Uint8Array(await new Response(object.body).arrayBuffer()),
    mime: object.contentType ?? fallbackMime
  };
}

/** The page's own SEO tab picks an og:image out of its `pageAssets`, and stores the same
 * authenticated URL the Studio renders (`/api/landings/:id/assets/:assetId/file`) — this maps
 * that URL back to the row so publish can ship the bytes. */
const PAGE_ASSET_FILE_URL = /\/assets\/([^/]+)\/file$/;

/**
 * FR-G-05 og:image, most specific source first: the page's own `seo.ogImage` (Studio SEO tab)
 * → the campaign's OG image (`entityImages`, shared by every page of that campaign) → the
 * auto-captured `.thumbnail.jpg` fallback. Each step falls through if its bytes are gone.
 */
async function resolveOgImage(
  db: Db,
  orgId: string,
  draftStorage: ReturnType<typeof createStorageFromEnv>,
  landingPage: {
    id: string;
    campaignId: string | null;
    thumbnailKey: string | null;
  },
  seoOgImageSrc: string | undefined
): Promise<OgImage | undefined> {
  const assetId = seoOgImageSrc
    ? PAGE_ASSET_FILE_URL.exec(seoOgImageSrc)?.[1]
    : undefined;
  if (assetId) {
    const asset = await pageAssetsRepository.findById(db, orgId, assetId);
    if (asset && asset.landingPageId === landingPage.id) {
      const image = await readStorageImage(
        draftStorage,
        asset.r2Key,
        asset.mime
      );
      if (image) return image;
    }
  }

  if (landingPage.campaignId) {
    const row = await entityImagesRepository.findByRef(db, orgId, {
      ownerType: "campaign",
      ownerId: landingPage.campaignId,
      kind: "og_image"
    });
    if (row) {
      const image = await readStorageImage(draftStorage, row.r2Key, row.mime);
      if (image) return image;
    }
  }

  if (!landingPage.thumbnailKey) return undefined;
  return readStorageImage(draftStorage, landingPage.thumbnailKey, "image/jpeg");
}

/**
 * Every uploaded asset of this page as bytes + the draft URL the editor wrote into the markup,
 * for `buildPublishArtifacts` to hash into `/assets/*` and rewrite. Shared by both publish
 * branches: a `pageAssets` row is reachable from the legacy srcmap editor AND from the native
 * Studio's image/video fields.
 */
async function loadPageAssets(
  db: Db,
  orgId: string,
  landingPageId: string,
  draftStorage: ReturnType<typeof createStorageFromEnv>
): Promise<PublishPipelineInput["assets"]> {
  const rows = await pageAssetsRepository.listByLandingPage(
    db,
    orgId,
    landingPageId
  );
  async function load(key: string, originalUrl: string, mime: string) {
    const object = await draftStorage.get(key);
    if (!object) throw new ApiError(404, "asset_not_found", key);
    return {
      originalUrl,
      bytes: new Uint8Array(await new Response(object.body).arrayBuffer()),
      mime
    };
  }

  const loads = rows.flatMap((asset) => {
    const base = `/api/landings/${landingPageId}/assets/${asset.id}`;
    const entries = [load(asset.r2Key, `${base}/file`, asset.mime)];
    // FR-B-29 video poster — `video[poster]` is one of the attributes the rewriter fixes up,
    // so the poster has to be bundled alongside the video or it stays behind auth.
    if (asset.posterKey) {
      entries.push(load(asset.posterKey, `${base}/poster`, "image/jpeg"));
    }
    return entries;
  });
  return Promise.all(loads);
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

type LandingPageRow = NonNullable<
  Awaited<ReturnType<typeof landingPagesRepository.findById>>
>;
type PageVersionRow = NonNullable<
  Awaited<ReturnType<typeof pageVersionsRepository.findById>>
>;

/**
 * Builds the final HTML + asset bytes for one landing page — everything the publish pipeline
 * does *before* it decides to go live. Shared by `publishLandingPage` (writes to the deployment
 * bucket, flips the hostname pointer) and `previewLandingPage` (writes to a token path, changes
 * nothing live), so a preview is byte-for-byte what publishing would produce.
 */
async function buildLandingArtifacts(
  db: Db,
  env: Bindings,
  orgId: string,
  landingPage: LandingPageRow,
  version: PageVersionRow,
  options: { hostname: string; deployId: string; assetBasePath?: string }
): Promise<{ artifacts: PublishPipelineOutput; noindex: boolean }> {
  const { hostname, deployId, assetBasePath } = options;
  const draftStorage = createStorageFromEnv(env);
  // Native (PageSpec) vs legacy (srcmap HTML) — `seo.title`/`noindex`/`ogImage` only exist on
  // the native document; a legacy page carries its own <head> markup.
  const doc = version.spec
    ? nativePageDocumentSchema.parse(version.spec)
    : null;
  const seo = doc?.seo;

  const [ogImage, structuredData] = await Promise.all([
    resolveOgImage(db, orgId, draftStorage, landingPage, seo?.ogImage?.src),
    resolveStructuredData(db, orgId, landingPage.campaignId)
  ]);

  const runtimeConfig = {
    orgId,
    campaignId: landingPage.campaignId,
    deployId,
    // FR-D-01/03: the embedded runtime script's own public API origin + Turnstile site
    // key — both were previously never injected, so a published landing's form could
    // never actually reach `/public/leads` nor produce a valid Turnstile token.
    apiUrl: env.BETTER_AUTH_URL,
    turnstileSiteKey: env.TURNSTILE_SITE_KEY,
    // `tracking-and-attribution.md` §Identity — page_id/page_version_id travel to the
    // beacon/lead-submit via this config, not from edge-router's KV pointer (which only
    // knows org/campaign/deploy).
    landingPageId: landingPage.id,
    pageVersionId: version.id
  };
  const runtimeScript = (await readRuntimeScript(env)) ?? undefined;
  const shared = {
    hostname,
    // `seo.title` overrides the page name (architecture-and-data-model.md §Publish · SEO).
    title: seo?.title?.trim() || landingPage.name,
    ogImage,
    structuredData,
    runtimeConfig,
    runtimeScript,
    assetBasePath
  };

  // `renderPageArtifact` already wraps `buildPublishArtifacts` internally (roadmap.md
  // §Publish-time SSR renderer), so the two branches converge on the same output shape.
  const artifacts: PublishPipelineOutput = doc
    ? await renderPageArtifact({
        ...shared,
        spec: doc.pageSpec as Spec,
        tokens: doc.tokens,
        description: seo?.description,
        noindex: seo?.noindex,
        // A native page's images come from the same `pageAssets` table (Studio's image
        // fields upload there) — without this they'd ship pointing at the authenticated
        // draft endpoint, which no published visitor can read.
        assets: await loadPageAssets(db, orgId, landingPage.id, draftStorage)
      })
    : await (async () => {
        if (!version.htmlKey) throw new ApiError(404, "html_not_found");
        const htmlKey = version.htmlKey;
        const [object, assets] = await Promise.all([
          draftStorage.get(htmlKey),
          loadPageAssets(db, orgId, landingPage.id, draftStorage)
        ]);
        if (!object) throw new ApiError(404, "html_not_found");
        return buildPublishArtifacts({
          ...shared,
          html: await new Response(object.body).text(),
          assets
        });
      })();

  return { artifacts, noindex: seo?.noindex === true };
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

/** The page + the version that would go live right now — the same lookup (and the same 404s)
 * for a real publish and for a preview of what it would produce. */
async function loadCurrentVersion(
  db: Db,
  orgId: string,
  landingPageId: string
): Promise<{ landingPage: LandingPageRow; version: PageVersionRow }> {
  const landingPage = await landingPagesRepository.findById(
    db,
    orgId,
    landingPageId
  );
  if (!landingPage || landingPage.deletedAt || !landingPage.currentVersionId) {
    throw new ApiError(404, "landing_page_not_found");
  }
  const version = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!version) throw new ApiError(404, "page_version_not_found");
  return { landingPage, version };
}

/**
 * Private pre-publish preview (`ui-ux-design.md` §Studio "Nút [Preview] ở TopBar") — renders
 * exactly what publishing would ship, to an unguessable token path in draft storage. No
 * `deployments` row, no outbox entry, no hostname pointer: nothing about what's live changes,
 * and none of publish's gates (audit threshold, asset confirmation, subdomain claim) apply,
 * since this IS the step where the user checks the page before facing those gates.
 */
export async function previewLandingPage(
  db: Db,
  env: Bindings,
  orgId: string,
  landingPageId: string
): Promise<{ path: string }> {
  const { landingPage, version } = await loadCurrentVersion(
    db,
    orgId,
    landingPageId
  );

  // 122 bits of randomness in the path is the access control here — the preview is served by
  // an unauthenticated route (a phone/other browser has to be able to open it).
  const token = crypto.randomUUID();
  const basePath = `${PREVIEW_BASE_PATH}/${token}`;
  const { artifacts } = await buildLandingArtifacts(
    db,
    env,
    orgId,
    landingPage,
    version,
    {
      hostname: hostnameFor(env, "preview"),
      deployId: `preview-${token}`,
      assetBasePath: basePath
    }
  );

  // ponytail: previews are never garbage-collected — they're small and unreachable once the
  // token is forgotten. Add a retention sweep alongside the `pageVersions` pruning job if the
  // draft bucket's size ever becomes a real cost.
  const draftStorage = createStorageFromEnv(env);
  await Promise.all([
    draftStorage.put({
      key: `${PREVIEW_KEY_PREFIX}/${token}/index.html`,
      body: artifacts.html,
      contentType: "text/html"
    }),
    ...artifacts.assets.map((asset) =>
      draftStorage.put({
        key: `${PREVIEW_KEY_PREFIX}/${token}/${asset.key}`,
        body: asset.bytes,
        contentType: asset.mime
      })
    )
  ]);

  // Trailing slash: the serving route matches `/preview/:token/*`, and `""` there is the
  // page itself (`index.html`).
  return { path: `${basePath}/` };
}

/** Runs the whole build_deploy pipeline for one landing page (architecture.md §5.2). */
export async function publishLandingPage(
  db: Db,
  env: Bindings,
  orgId: string,
  landingPageId: string,
  subdomain: string
): Promise<PublishResult> {
  const { landingPage, version } = await loadCurrentVersion(
    db,
    orgId,
    landingPageId
  );

  // FR-B-35 (legacy srcmap flow only — native pages don't use draftStorage-hosted pageAssets):
  // an import-flagged asset (unverifiedSource) blocks publish until the tenant ticks "Tôi có
  // quyền sử dụng ảnh này" (landings/routes.ts PATCH .../assets/:assetId) — the platform only
  // warns, the tenant takes on copyright responsibility by confirming.
  if (!version.spec) {
    const assetRows = await pageAssetsRepository.listByLandingPage(
      db,
      orgId,
      landingPageId
    );
    const unconfirmed = assetRows.filter(
      (asset) => asset.unverifiedSource && !asset.usageConfirmed
    );
    if (unconfirmed.length > 0) {
      throw new ApiError(409, "unverified_assets_pending_confirmation");
    }
  }

  // quality-spec.md §Launch threshold — native pages only; the legacy srcmap flow never had a
  // quality-audit system to begin with. Must be an audit *of this exact version*, not a stale
  // one from before the last edit.
  if (version.spec) {
    const auditRuns = await auditRunsRepository.listByLandingPage(
      db,
      orgId,
      landingPageId
    );
    const latestAudit = auditRuns.find(
      (run) => run.pageVersionId === version.id
    );
    if (!latestAudit) throw new ApiError(409, "audit_required");
    const findingRows = await auditFindingsRepository.listByAuditRun(
      db,
      orgId,
      latestAudit.id
    );
    const { ok, reasons } = passesLaunchThreshold(
      auditResultSchema.parse({ ...latestAudit, findings: findingRows })
    );
    if (!ok) {
      throw new ApiError(
        409,
        "audit_launch_threshold_not_met",
        reasons.join(",")
      );
    }
  }

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
    pageVersionId: version.id,
    hostname,
    status: "building",
    r2Prefix: "", // filled in right below, once the deployment id (part of the prefix) exists
    meta: {}
  });
  if (!deployment) throw new ApiError(500, "deployment_create_failed");
  const r2Prefix = `deployments/${deployment.id}`;
  await deploymentsRepository.update(db, orgId, deployment.id, { r2Prefix });

  const deployStorage = createDeploymentStorage(env);
  try {
    const { artifacts, noindex } = await buildLandingArtifacts(
      db,
      env,
      orgId,
      landingPage,
      version,
      { hostname, deployId: deployment.id }
    );

    // FR-G-05 — edge-router generates robots.txt/sitemap.xml per hostname, but serves a
    // deployment-local copy when one exists; a `seo.noindex` page ships that copy so the
    // opt-out survives rollback to (or from) any other deployment of the same hostname.
    if (noindex) {
      artifacts.assets.push(
        {
          key: "robots.txt",
          bytes: new TextEncoder().encode("User-agent: *\nDisallow: /\n"),
          mime: "text/plain; charset=utf-8"
        },
        {
          key: "sitemap.xml",
          bytes: new TextEncoder().encode(
            '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n'
          ),
          mime: "application/xml; charset=utf-8"
        }
      );
    }

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
