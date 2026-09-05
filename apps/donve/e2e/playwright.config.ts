import { defineConfig, devices } from "@playwright/test";

/**
 * Full-stack browser E2E for the core revenue loop (publish → lead capture → SePay webhook →
 * fulfillment). Not part of `bun run test` (that's vitest unit/integration only) — this needs
 * the whole dev stack (`bun run dev`: api :3000, donve :5173) already running, same as a human
 * clicking through the app. Run via `bun run test:e2e` from `apps/donve`.
 */
export default defineConfig({
  testDir: ".",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
