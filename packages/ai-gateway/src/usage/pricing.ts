import type { TokenUsage } from "../providers/types.js";

/** 1 credit = $0.001 USD — the unit `aiUsage.creditCost` (an integer column) is stored in. */
export const USD_PER_CREDIT = 0.001;

export interface ModelPricing {
  /** USD per 1,000,000 input tokens. */
  inputPerMTok: number;
  /** USD per 1,000,000 output tokens. */
  outputPerMTok: number;
}

export class UnknownModelPricingError extends Error {
  constructor(model: string) {
    super(
      `No pricing entry for model "${model}" — add one to the provider's pricing table ` +
        "before routing usage through it (billing must never silently under-count)."
    );
  }
}

/** Converts token usage to integer credits, rounding up so usage is never under-billed. */
export function creditsForUsage(
  usage: TokenUsage,
  pricing: ModelPricing
): number {
  const usd =
    (usage.inputTokens / 1_000_000) * pricing.inputPerMTok +
    (usage.outputTokens / 1_000_000) * pricing.outputPerMTok;
  return Math.ceil(usd / USD_PER_CREDIT);
}
