import { createNeonDb, createPostgresDb } from "@dv/db";
import type { Db } from "@dv/db";

import type { Bindings } from "../types.js";

/**
 * CF Workers gets the HTTP driver (no persistent connection possible there,
 * and `neon()` is a cheap stateless fetch wrapper) — built fresh per request,
 * same convention as `lib/cache.ts`'s `createCacheFromEnv(...)`.
 *
 * Bun/VPS gets the pooled `postgres.js` driver — architecture.md §3. That pool
 * is a real TCP connection pool and MUST be a process-wide singleton: creating
 * one per request (the old behavior here) opens a fresh pool on every request
 * that's never closed, exhausting Postgres's connection limit almost
 * immediately under any real traffic.
 */
let bunDbSingleton: Db | undefined;

export function createDbFromEnv(env: Bindings): Db {
  if (env.RUNTIME === "workers") {
    return createNeonDb(env.DATABASE_URL);
  }
  bunDbSingleton ??= createPostgresDb(env.DATABASE_URL);
  return bunDbSingleton;
}
