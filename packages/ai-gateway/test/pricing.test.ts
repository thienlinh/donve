import { describe, expect, it } from "vitest";

import { creditsForUsage } from "../src/usage/pricing.js";

describe("creditsForUsage", () => {
  it("converts token usage to integer credits, rounding up", () => {
    const credits = creditsForUsage(
      { inputTokens: 1_000_000, outputTokens: 0 },
      { inputPerMTok: 3, outputPerMTok: 15 }
    );
    // $3 at $0.001/credit = 3000 credits
    expect(credits).toBe(3000);
  });

  it("rounds a fractional credit up rather than truncating", () => {
    const credits = creditsForUsage(
      { inputTokens: 1, outputTokens: 0 },
      { inputPerMTok: 3, outputPerMTok: 15 }
    );
    expect(credits).toBe(1);
  });

  it("returns 0 for free models", () => {
    const credits = creditsForUsage(
      { inputTokens: 1_000_000, outputTokens: 1_000_000 },
      { inputPerMTok: 0, outputPerMTok: 0 }
    );
    expect(credits).toBe(0);
  });
});
