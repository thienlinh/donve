import { eventTypeValues, landingUtmSchema } from "@dv/contracts";

interface DeploymentPointer {
  deployId: string;
  orgId: string;
  campaignId: string | null;
}

interface QueuedEvent {
  orgId: string;
  campaignId: string | null;
  deploymentId: string | null;
  type: string;
  sessionHash: string;
  anonymousId: string | null;
  landingPageId: string | null;
  pageVersionId: string | null;
  meta: Record<string, unknown>;
}

interface Env {
  HOSTNAME_KV: KVNamespace;
  DEPLOYMENTS_BUCKET: R2Bucket;
  EVENTS_QUEUE: Queue<QueuedEvent>;
  BEACON_RL: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
}

const IMMUTABLE_ASSET_CACHE = "public, max-age=31536000, immutable";
// architecture.md §5.2: the root document is never put into caches.default (see
// isRootDocument branch below), so this only bounds how long a browser/intermediary may
// hold onto it — rollback/unpublish (KV pointer swap) is still re-checked against KV+R2 on
// every edge request. A short max-age keeps repeat views fast without meaningfully delaying
// rollback propagation past a few seconds.
const ROOT_DOCUMENT_CACHE = "max-age=5, stale-while-revalidate=30";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/e/")) {
      return handleBeacon(request, env, ctx, url);
    }

    if (url.pathname === "/sitemap.xml" || url.pathname === "/robots.txt") {
      return handleSeoFile(env, url);
    }

    return handleLanding(request, env, ctx, url);
  }
} satisfies ExportedHandler<Env>;

async function handleLanding(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  url: URL
): Promise<Response> {
  const isRootDocument = url.pathname === "/" || url.pathname === "/index.html";
  const objectPath = isRootDocument ? "/index.html" : url.pathname;

  const cacheKey = new Request(url.toString(), request);
  if (!isRootDocument) {
    const cached = await caches.default.match(cacheKey);
    if (cached) return cached;
  }

  const pointer = await env.HOSTNAME_KV.get<DeploymentPointer>(
    url.hostname,
    "json"
  );
  if (!pointer) return notFound();

  const object = await env.DEPLOYMENTS_BUCKET.get(
    `deployments/${pointer.deployId}${objectPath}`
  );
  if (!object) return notFound();

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set(
    "Cache-Control",
    isRootDocument ? ROOT_DOCUMENT_CACHE : IMMUTABLE_ASSET_CACHE
  );

  const response = new Response(object.body, { headers });
  if (!isRootDocument) {
    ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
  }
  return response;
}

/**
 * FR-G-05 — sitemap.xml/robots.txt per subdomain. Generated on the fly from the hostname
 * rather than stored per-deployment in R2: content only depends on the hostname itself (one
 * landing page per subdomain, always at `/`), so it stays correct across republishes without
 * needing to be regenerated/re-uploaded on every publish.
 */
async function handleSeoFile(env: Env, url: URL): Promise<Response> {
  const pointer = await env.HOSTNAME_KV.get<DeploymentPointer>(
    url.hostname,
    "json"
  );
  if (!pointer) return notFound();

  // A `seo.noindex` page ships its own robots.txt/sitemap.xml with the deployment (see
  // apps/api/src/lib/publish.ts) — that copy wins over the generated default below, and
  // rollback swaps it along with everything else in the deployment.
  const shipped = await env.DEPLOYMENTS_BUCKET.get(
    `deployments/${pointer.deployId}${url.pathname}`
  );
  if (shipped) {
    const headers = new Headers();
    shipped.writeHttpMetadata(headers);
    headers.set("Cache-Control", ROOT_DOCUMENT_CACHE);
    return new Response(shipped.body, { headers });
  }

  const origin = `https://${url.hostname}`;
  const body =
    url.pathname === "/sitemap.xml"
      ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`
      : `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`;
  const contentType =
    url.pathname === "/sitemap.xml"
      ? "application/xml; charset=utf-8"
      : "text/plain; charset=utf-8";

  return new Response(body, {
    headers: {
      "content-type": contentType,
      // Not immutable: toggling `seo.noindex` republishes and swaps this file's content for the
      // same URL, so it has to expire on the same short horizon as the root document.
      "Cache-Control": ROOT_DOCUMENT_CACHE
    }
  });
}

async function handleBeacon(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  url: URL
): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405 });

  const type = url.pathname.slice("/e/".length);
  if (!(eventTypeValues as readonly string[]).includes(type)) {
    return new Response(null, { status: 400 });
  }

  const pointer = await env.HOSTNAME_KV.get<DeploymentPointer>(
    url.hostname,
    "json"
  );
  if (!pointer) return notFound();

  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const rateLimitKey = `${ip}:${pointer.campaignId ?? "none"}`;
  const { success } = await env.BEACON_RL.limit({ key: rateLimitKey });
  if (!success) return new Response(null, { status: 429 });

  const body: Record<string, unknown> = await request
    .json()
    .then((value): Record<string, unknown> =>
      value && typeof value === "object"
        ? (value as Record<string, unknown>)
        : {}
    )
    .catch((): Record<string, unknown> => ({}));
  const meta =
    body.meta && typeof body.meta === "object"
      ? (body.meta as Record<string, unknown>)
      : {};

  // `tracking-and-attribution.md` §UTM governance: reject before it ever reaches `events`,
  // don't silently drop or pass through an unrecognized shape.
  if (meta.utm !== undefined && !landingUtmSchema.safeParse(meta.utm).success) {
    return new Response(null, { status: 400 });
  }

  const event: QueuedEvent = {
    orgId: pointer.orgId,
    campaignId: pointer.campaignId,
    deploymentId: pointer.deployId,
    type,
    sessionHash: await hashSession(ip, request.headers.get("user-agent") ?? ""),
    anonymousId: typeof body.anonymousId === "string" ? body.anonymousId : null,
    landingPageId:
      typeof body.landingPageId === "string" ? body.landingPageId : null,
    pageVersionId:
      typeof body.pageVersionId === "string" ? body.pageVersionId : null,
    meta
  };

  // fire-and-forget: response returns before the queue write completes.
  ctx.waitUntil(env.EVENTS_QUEUE.send(event));
  return new Response(null, { status: 204 });
}

async function hashSession(ip: string, userAgent: string): Promise<string> {
  const day = new Date().toISOString().slice(0, 10);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${ip}:${userAgent}:${day}`)
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function notFound(): Response {
  return new Response("Landing không tồn tại", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" }
  });
}
