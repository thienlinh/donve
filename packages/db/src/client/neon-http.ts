import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "../schema/index.js";
import type { Db } from "./types.js";

/** CF Workers entrypoint (apps/api workers.ts). HTTP driver — no persistent connection. */
export function createNeonDb(databaseUrl: string): Db {
  const client = neon(databaseUrl);
  return { kind: "neon-http", raw: drizzle(client, { schema }) };
}
