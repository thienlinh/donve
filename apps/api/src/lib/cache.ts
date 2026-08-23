import { cache, realtime } from "@dv/drivers";

import type { Bindings } from "../types.js";

/**
 * CF Workers gets the Upstash REST driver (stateless fetch, cheap per request — same
 * convention as `lib/db.ts`). Bun/VPS gets a plain-Redis driver pointed at docker-compose's
 * local Redis (architecture.md §3 `cache(upstash|ioredis)`) instead of requiring real Upstash
 * credentials just to run `bun run dev`.
 */
export function createCacheFromEnv(env: Bindings): cache.CacheDriver {
  if (env.RUNTIME === "workers") {
    return cache.createUpstashCacheDriver({
      url: env.UPSTASH_REDIS_URL,
      token: env.UPSTASH_REDIS_TOKEN
    });
  }
  return cache.createIoredisCacheDriver({
    url: env.LOCAL_REDIS_URL ?? "redis://localhost:6379"
  });
}

/** Same CF↔VPS split as `createCacheFromEnv`, for the pub/sub side (architecture.md §5.3). */
export function createRealtimeFromEnv(env: Bindings): realtime.RealtimeDriver {
  if (env.RUNTIME === "workers") {
    return realtime.createUpstashRealtimeDriver({
      url: env.UPSTASH_REDIS_URL,
      token: env.UPSTASH_REDIS_TOKEN
    });
  }
  return realtime.createIoredisRealtimeDriver({
    url: env.LOCAL_REDIS_URL ?? "redis://localhost:6379"
  });
}
