import { createApp } from "./app.js";
import { log } from "./lib/logger.js";
import type { Bindings } from "./types.js";

const bindings: Bindings = {
  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL ?? "",
  UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN ?? "",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "",
  BETTER_AUTH_URL:
    process.env.BETTER_AUTH_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`,
  DASHBOARD_URL: process.env.DASHBOARD_URL ?? "http://localhost:5173",
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  RUNTIME: "bun"
};

const app = createApp();
const port = Number(process.env.PORT ?? 3000);

Bun.serve({
  port,
  fetch: (request) => app.fetch(request, bindings)
});

log("info", {
  requestId: "startup",
  orgId: null,
  message: `api listening on :${port}`
});
