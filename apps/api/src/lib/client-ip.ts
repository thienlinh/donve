import type { Context } from "hono";

import type { AppEnv } from "../types.js";

/** Best-effort client IP — trusts CF's own header first, falls back to the standard proxy one. */
export function clientIp(c: Context<AppEnv>): string | undefined {
  return (
    c.req.header("cf-connecting-ip") ??
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
    undefined
  );
}
