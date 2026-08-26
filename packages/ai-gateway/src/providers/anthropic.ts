import { createAnthropic } from "@ai-sdk/anthropic";

import type { ModelPricing } from "../usage/pricing.js";
import {
  countCostFromPricing,
  streamViaAiSdk,
  validateKeyViaModelsEndpoint
} from "./shared.js";
import type {
  AIProvider,
  ChatRequest,
  DecryptedKey,
  ModelOption,
  TokenUsage
} from "./types.js";

/** Direct Anthropic — used when an org has its own key instead of routing through OpenRouter. */
const PRICING: Record<string, ModelPricing> = {
  "claude-sonnet-4-5": { inputPerMTok: 3, outputPerMTok: 15 },
  "claude-haiku-4-5": { inputPerMTok: 1, outputPerMTok: 5 }
};

export function createAnthropicProvider(): AIProvider {
  return {
    id: "anthropic",

    stream(req: ChatRequest, key: DecryptedKey) {
      const anthropic = createAnthropic({ apiKey: key.apiKey });
      return streamViaAiSdk(anthropic(req.model), req);
    },

    model(modelId: string, key: DecryptedKey) {
      return createAnthropic({ apiKey: key.apiKey })(modelId);
    },

    validateKey(key: string) {
      return validateKeyViaModelsEndpoint(
        "https://api.anthropic.com/v1/models",
        { "x-api-key": key, "anthropic-version": "2023-06-01" },
        (body): ModelOption[] =>
          Array.isArray((body as { data?: unknown }).data)
            ? (
                body as { data: { id: string; display_name?: string }[] }
              ).data.map((m) => ({ id: m.id, description: m.display_name }))
            : []
      );
    },

    countCost(usage: TokenUsage, model: string) {
      return countCostFromPricing(PRICING, usage, model);
    }
  };
}
