import { createMiddleware } from "hono/factory";

import { log } from "../lib/logger.js";
import type { AppEnv } from "../types.js";

/**
 * Assigns/propagates a requestId, times the request, and emits one
 * structured JSON log line per response (architecture.md §8). `orgId`
 * starts null — auth middleware sets it via `c.set("orgId", ...)` once
 * session/org resolution is wired in.
 */
export const requestContext = createMiddleware<AppEnv>(async (c, next) => {
  const requestId = c.req.header("x-request-id") ?? crypto.randomUUID();
  c.set("requestId", requestId);
  c.set("orgId", null);
  c.header("x-request-id", requestId);

  const start = performance.now();
  await next();
  const durationMs = Math.round(performance.now() - start);

  log("info", {
    requestId,
    orgId: c.get("orgId"),
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    durationMs,
  });
});
