import { cache } from "@dv/drivers";
import { createMiddleware } from "hono/factory";

import { ApiError } from "../lib/errors.js";
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
 * CF↔VPS (architecture.md §1 principle #2); a VPS ioredis `CacheDriver` swaps
 * in later without touching this middleware.
 */
export function rateLimit(opts: RateLimitOptions) {
  return createMiddleware<AppEnv>(async (c, next) => {
    const driver = cache.createUpstashCacheDriver({
      url: c.env.UPSTASH_REDIS_URL,
      token: c.env.UPSTASH_REDIS_TOKEN
    });

    const clientIp =
      c.req.header("cf-connecting-ip") ??
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const key = `ratelimit:${opts.keyPrefix ?? c.req.path}:${clientIp}`;

    const count = await driver.incr(key, { ttlSeconds: opts.windowSeconds });
    const remaining = Math.max(0, opts.max - count);

    c.header("x-ratelimit-limit", String(opts.max));
    c.header("x-ratelimit-remaining", String(remaining));

    if (count > opts.max) {
      c.header("retry-after", String(opts.windowSeconds));
      throw new ApiError(429, "rate_limited", "Too many requests");
    }

    await next();
  });
}
