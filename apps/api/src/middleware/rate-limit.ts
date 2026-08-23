import type { Context } from "hono";
import { createMiddleware } from "hono/factory";

import { createCacheFromEnv } from "../lib/cache.js";
import { clientIp } from "../lib/client-ip.js";
import { ApiError } from "../lib/errors.js";
import { log } from "../lib/logger.js";
import type { AppEnv } from "../types.js";

export interface RateLimitOptions {
  windowSeconds: number;
  max: number;
  /** Defaults to the request path — pass a fixed value to share a bucket across a route group. */
  keyPrefix?: string;
}

/**
 * Fixed-window counter built on `CacheDriver.incr` (packages/drivers) rather
 * than `@upstash/ratelimit` directly — the driver is already portable
 * CF↔VPS (architecture.md §1 principle #2) via `createCacheFromEnv`.
 */
export function rateLimit(opts: RateLimitOptions) {
  return createMiddleware<AppEnv>(async (c, next) => {
    await checkRateLimit(
      c,
      `ratelimit:${opts.keyPrefix ?? c.req.path}:${clientIp(c) ?? "unknown"}`,
      opts
    );
    await next();
  });
}

/**
 * Same fixed-window check as `rateLimit`, but for routes that need a key only
 * known after a DB lookup (NFR-16: IP + campaign for the order-status poll,
 * where campaign comes from the order the `:code` param resolves to).
 */
export async function rateLimitByKey(
  c: Context<AppEnv>,
  key: string,
  opts: Pick<RateLimitOptions, "windowSeconds" | "max">
): Promise<void> {
  await checkRateLimit(c, `ratelimit:${key}`, opts);
}

async function checkRateLimit(
  c: Context<AppEnv>,
  key: string,
  opts: Pick<RateLimitOptions, "windowSeconds" | "max">
): Promise<void> {
  const driver = createCacheFromEnv(c.env);

  let count: number;
  try {
    count = await driver.incr(key, { ttlSeconds: opts.windowSeconds });
  } catch (err) {
    // Fail open, not closed: this guards public endpoints (leads, order-status polling,
    // webhooks) against IP-flood abuse, but it is not itself the security boundary — Turnstile
    // + honeypot + webhook-secret verification still stand. If the rate-limit store (Upstash)
    // is briefly unreachable, taking the whole endpoint down is a worse outcome than
    // temporarily going unlimited. Found live: an unreachable store previously turned every
    // rate-limited route into a hard 500, discarding requests that had nothing to do with abuse.
    log("warn", {
      requestId: c.get("requestId"),
      orgId: c.get("orgId"),
      message: "rate-limit store unavailable, allowing request through",
      key,
      error: err instanceof Error ? err.message : String(err)
    });
    return;
  }

  const remaining = Math.max(0, opts.max - count);

  c.header("x-ratelimit-limit", String(opts.max));
  c.header("x-ratelimit-remaining", String(remaining));

  if (count > opts.max) {
    c.header("retry-after", String(opts.windowSeconds));
    throw new ApiError(429, "rate_limited", "Too many requests");
  }
}
