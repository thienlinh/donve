import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../schema/index.js";
import type { Db } from "./types.js";

/** Bun/VPS entrypoint (apps/api bun.ts). Real pooled connection, real transactions. */
export function createPostgresDb(databaseUrl: string): Db {
  const client = postgres(databaseUrl);
  return { kind: "postgres-js", raw: drizzle(client, { schema }) };
}
