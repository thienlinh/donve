import { Hono } from "hono"
import { cors } from "hono/cors"

import { createAuthFromEnv } from "./lib/auth.js"
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js"
import { rateLimit } from "./middleware/rate-limit.js"
import { requestContext } from "./middleware/request-context.js"
import type { AppEnv } from "./types.js"

/**
 * Hono app instance shared by both entrypoints (workers.ts CF / bun.ts VPS).
 * Business modules (auth, orgs, studio, campaigns, ...) mount here as they
 * land — this is the skeleton: request context, error handling, rate limit.
 */
export function createApp() {
  const app = new Hono<AppEnv>()

  app.use("*", requestContext)
  // The dashboard SPA runs on a different origin in dev (Vite) and prod (CF
  // Pages) — only `/api/*` needs CORS, `/public/*`/`/webhooks/*` are called
  // server-to-server or from the published landing runtime, not the SPA.
  app.use(
    "/api/*",
    cors({
      origin: (_origin, c) => c.env.DASHBOARD_URL,
      credentials: true,
    })
  )
  // Public/unauthenticated surfaces (architecture.md §6) get IP-scoped limits;
  // authenticated routes get their own limiter once session middleware lands.
  app.use("/public/*", rateLimit({ windowSeconds: 60, max: 30 }))
  app.use("/webhooks/*", rateLimit({ windowSeconds: 60, max: 60 }))

  app.onError(errorHandler)
  app.notFound(notFoundHandler)

  app.get("/healthz", (c) => c.json({ ok: true }))

  // Better Auth's own handler serves `/api/auth/session`, `/api/auth/sign-in/email`,
  // `/api/auth/organization/*` (org plugin), etc. — built fresh per request (lib/auth.ts).
  app.on(["GET", "POST"], "/api/auth/*", (c) =>
    createAuthFromEnv(c.env).handler(c.req.raw)
  )

  return app
}
