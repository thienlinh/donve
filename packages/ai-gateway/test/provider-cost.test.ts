import { describe, expect, it } from "vitest";

import { getProvider } from "../src/providers/registry.js";
import { countCostFromPricing } from "../src/providers/shared.js";
import { UnknownModelPricingError } from "../src/usage/pricing.js";

const PRICING = {
  "known-model": { inputPerMTok: 3, outputPerMTok: 15 }
};

describe("countCostFromPricing", () => {
  it("computes integer credits for a known model", () => {
    // $3 at $0.001/credit = 3000 credits (see creditsForUsage in pricing.test.ts)
    const credits = countCostFromPricing(
      PRICING,
      { inputTokens: 1_000_000, outputTokens: 0 },
      "known-model"
    );
    expect(credits).toBe(3000);
  });

  it("throws UnknownModelPricingError for a model with no pricing entry", () => {
    expect(() =>
      countCostFromPricing(
        PRICING,
        { inputTokens: 1, outputTokens: 1 },
        "unknown-model"
      )
    ).toThrow(UnknownModelPricingError);
  });
});

describe("nvidia provider countCost", () => {
  it("returns 0 for any model, not just a hardcoded subset (free-tier dev keys)", () => {
    const nvidia = getProvider("nvidia");
    expect(
      nvidia.countCost(
        { inputTokens: 1_000_000, outputTokens: 1_000_000 },
        "nvidia/nemotron-3-ultra-550b-a55b"
      )
    ).toBe(0);
    expect(
      nvidia.countCost({ inputTokens: 1, outputTokens: 1 }, "any/other-model")
    ).toBe(0);
  });
});
