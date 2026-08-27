import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  test: {
    // real Postgres container start + drizzle-kit migrate + real HTTP round trips
    // through the mounted Hono app — slower than unit tests.
    testTimeout: 60_000,
    hookTimeout: 60_000
  }
});
