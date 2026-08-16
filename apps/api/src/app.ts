import { Hono } from "hono"

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
  // Public/unauthenticated surfaces (architecture.md §6) get IP-scoped limits;
  // authenticated routes get their own limiter once session middleware lands.
  app.use("/public/*", rateLimit({ windowSeconds: 60, max: 30 }))
  app.use("/webhooks/*", rateLimit({ windowSeconds: 60, max: 60 }))

  app.onError(errorHandler)
  app.notFound(notFoundHandler)

  app.get("/healthz", (c) => c.json({ ok: true }))

  return app
}
