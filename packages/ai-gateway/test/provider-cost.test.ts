import { describe, expect, it } from "vitest";

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
