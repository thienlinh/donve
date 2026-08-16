import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // real Postgres container start + drizzle-kit migrate — slower than unit tests
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
