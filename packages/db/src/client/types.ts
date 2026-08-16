import type { NeonHttpDatabase } from "drizzle-orm/neon-http"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

import type * as schema from "../schema/index.js"

export type Schema = typeof schema

/**
 * Tagged union over the two drivers this platform runs on (tech-stack.md):
 * `neon-http` for the CF Workers entrypoint, `postgres-js` for the Bun/VPS entrypoint.
 * withOrgScope branches on `kind` because the neon-http driver has no real
 * `.transaction()` — only `.batch()` (architecture.md §6.1) — while postgres-js does.
 */
export type Db =
  | { readonly kind: "neon-http"; readonly raw: NeonHttpDatabase<Schema> }
  | { readonly kind: "postgres-js"; readonly raw: PostgresJsDatabase<Schema> }
