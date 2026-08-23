import { Hono } from "hono";
import { cors } from "hono/cors";

import { createAuthFromEnv } from "./lib/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { rateLimit } from "./middleware/rate-limit.js";
import { requestContext } from "./middleware/request-context.js";
import { requireOrgSession } from "./middleware/require-org-session.js";
import { requirePlatformStaff } from "./middleware/require-platform-staff.js";
import { aiRoutes } from "./modules/ai/routes.js";
import { campaignsRoutes } from "./modules/campaigns/routes.js";
import { domainsRoutes } from "./modules/domains/routes.js";
import { landingsRoutes } from "./modules/landings/routes.js";
import { leadsRoutes } from "./modules/leads/routes.js";
import { tiktokWebhooksRoutes } from "./modules/leads/tiktok.js";
import { leadsWebhooksRoutes } from "./modules/leads/webhooks.js";
import { organizationsRoutes } from "./modules/organizations/routes.js";
import { paymentsRoutes } from "./modules/payments/routes.js";
import { platformRoutes } from "./modules/platform/routes.js";
import { productsRoutes } from "./modules/products/routes.js";
import { publicRoutes } from "./modules/public/routes.js";
import { studioRoutes } from "./modules/studio/routes.js";
import { webhooksRoutes } from "./modules/webhooks/routes.js";
import type { AppEnv } from "./types.js";

/**
 * Hono app instance shared by both entrypoints (workers.ts CF / bun.ts VPS).
 * Business modules (auth, orgs, studio, campaigns, ...) mount here as they
 * land — this is the skeleton: request context, error handling, rate limit.
 */
export function createApp() {
  const app = new Hono<AppEnv>();

  app.use("*", requestContext);
  // The dashboard SPA runs on a different origin in dev (Vite) and prod (CF Pages) — its
  // session cookie makes this a credentialed request, so the origin must be echoed exactly
  // (not `*`), and only the one known dashboard origin is ever legitimate here.
  const dashboardCors = cors({
    origin: (_origin, c) => c.env.DASHBOARD_URL,
    credentials: true
  });
  app.use("/api/*", dashboardCors);
  app.use("/platform/*", dashboardCors);
  // `/public/*` is called from `apps/landing-runtime`'s browser JS, which runs on WHATEVER
  // domain a tenant's landing page is published to (subdomain today, any custom domain via
  // FR-G-04) — that set is dynamic and can't be enumerated ahead of time, unlike the dashboard's
  // one fixed origin above. Wildcard + no credentials is correct and safe here specifically
  // because this surface never reads a session cookie: `orgId`/`campaignId` in the request body
  // pick the tenant, and Turnstile (`POST /public/leads`) is the anti-abuse gate, not origin
  // checking. Fixes a real bug: without this, every published landing page's lead form silently
  // fails in production (`No 'Access-Control-Allow-Origin' header` — a live test confirmed the
  // exact browser error before this was added), since API and landing pages are always
  // different origins outside local dev.
  app.use("/public/*", cors({ origin: "*" }));
  // Public/unauthenticated surfaces (architecture.md §6) get IP-scoped limits;
  // authenticated routes get their own limiter once session middleware lands.
  // `/public/orders/:code/status` is excluded here — NFR-16 gives it its own
  // IP+campaign limiter (modules/public/routes.ts) tuned for poll cadence
  // instead of this general per-IP bucket.
  app.use("/public/leads", rateLimit({ windowSeconds: 60, max: 30 }));
  app.use(
    "/public/orders/:code/confirm-transfer",
    rateLimit({ windowSeconds: 60, max: 30 })
  );
  app.use("/webhooks/*", rateLimit({ windowSeconds: 60, max: 60 }));
  // Separate gate from tenant auth entirely (platform-admin.md §4) — a valid tenant
  // session is not enough, the user must also have a `platform_staff` row.
  app.use("/platform/*", requirePlatformStaff);
  // First tenant-scoped module — resolves `orgId` from the session's active org.
  app.use("/api/landings/*", requireOrgSession);
  app.use("/api/domains/*", requireOrgSession);
  app.use("/api/studio/*", requireOrgSession);
  app.use("/api/ai/*", requireOrgSession);
  app.use("/api/products/*", requireOrgSession);
  app.use("/api/campaigns/*", requireOrgSession);
  app.use("/api/leads/*", requireOrgSession);
  app.use("/api/organizations/*", requireOrgSession);
  app.use("/api/payments/*", requireOrgSession);

  app.onError(errorHandler);
  app.notFound(notFoundHandler);

  app.get("/healthz", (c) => c.json({ ok: true }));

  // Better Auth's own handler serves `/api/auth/session`, `/api/auth/sign-in/email`,
  // `/api/auth/organization/*` (org plugin), etc. — built fresh per request (lib/auth.ts).
  app.on(["GET", "POST"], "/api/auth/*", (c) =>
    createAuthFromEnv(c.env).handler(c.req.raw)
  );

  app.route("/platform", platformRoutes);
  app.route("/api/landings", landingsRoutes);
  app.route("/api/domains", domainsRoutes);
  app.route("/api/studio", studioRoutes);
  app.route("/api/ai", aiRoutes);
  app.route("/api/products", productsRoutes);
  app.route("/api/campaigns", campaignsRoutes);
  app.route("/api/leads", leadsRoutes);
  app.route("/api/organizations", organizationsRoutes);
  app.route("/api/payments", paymentsRoutes);
  app.route("/public", publicRoutes);
  app.route("/webhooks", webhooksRoutes);
  // multi-source lead ingestion (Facebook Lead Ads / Zalo OA) — same `/webhooks/*` prefix as
  // `webhooksRoutes` above (SePay), deliberately NOT under `/api/leads/*` so it stays outside
  // `requireOrgSession` (see modules/leads/webhooks.ts doc comment).
  app.route("/webhooks", leadsWebhooksRoutes);
  // TikTok's OAuth redirect + LEAD webhook, same `/webhooks/*` prefix — separate module from
  // leadsWebhooksRoutes since TikTok's auth model (shared-app OAuth) differs entirely from
  // Facebook/Zalo/generic's per-org secret model (lead-integrations.md §D).
  app.route("/webhooks", tiktokWebhooksRoutes);

  return app;
}
