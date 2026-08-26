import { describe, expect, it } from "vitest";

import { getProvider } from "../src/providers/registry.js";
import type { ByokProviderId } from "../src/providers/types.js";

const PROVIDER_IDS: ByokProviderId[] = [
  "openrouter",
  "anthropic",
  "openai",
  "groq",
  "nvidia"
];

// No fetch-mock infra exists in this repo (no msw/nock), so this only smoke-tests the plain
// object lookup in registry.ts — `stream()`/`validateKey()`'s real HTTP/AI-SDK calls are
// deliberately not exercised here.
describe("getProvider", () => {
  for (const id of PROVIDER_IDS) {
    it(`resolves "${id}" to a provider whose id matches`, () => {
      expect(getProvider(id).id).toBe(id);
    });
  }
});
