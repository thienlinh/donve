import { defineConfig } from "@playwright/test";

const PORT = 4173;

/**
 * Golden screenshots + a11y (`roadmap.md` §Component Library "pass a11y automation, có golden
 * screenshot" — deferred from that step until a preview server existed; `e2e/preview-server.ts`
 * is that server). Both spec files assume `e2e/previews/` already exists — `bun run e2e`
 * generates it first; `webServer` only starts the static server, not the generator, since
 * previews only need regenerating when a component's example props/markup change.
 */
export default defineConfig({
  testDir: "./e2e",
  snapshotDir: "./e2e/__screenshots__",
  webServer: {
    command: `PORT=${PORT} bun run e2e/preview-server.ts`,
    port: PORT,
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: `http://localhost:${PORT}`
  }
});
