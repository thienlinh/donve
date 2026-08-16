import { createNeonDb, createPostgresDb } from "@dv/db"
import type { Db } from "@dv/db"

import type { Bindings } from "../types.js"

/**
 * CF Workers gets the HTTP driver (no persistent connection possible there);
 * Bun/VPS gets the pooled `postgres.js` driver — architecture.md §3. Built
 * fresh per request, same convention as `middleware/rate-limit.ts`'s
 * `cache.createUpstashCacheDriver(...)`.
 */
export function createDbFromEnv(env: Bindings): Db {
  return env.RUNTIME === "workers"
    ? createNeonDb(env.DATABASE_URL)
    : createPostgresDb(env.DATABASE_URL)
}
