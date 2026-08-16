import { createApp } from "./app.js"
import { log } from "./lib/logger.js"
import type { Bindings } from "./types.js"

const bindings: Bindings = {
  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL ?? "",
  UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN ?? "",
}

const app = createApp()
const port = Number(process.env.PORT ?? 3000)

Bun.serve({
  port,
  fetch: (request) => app.fetch(request, bindings),
})

log("info", {
  requestId: "startup",
  orgId: null,
  message: `api listening on :${port}`,
})
