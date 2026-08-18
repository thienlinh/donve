import { createOpenAI } from "@ai-sdk/openai";

import {
  creditsForUsage,
  UnknownModelPricingError,
  type ModelPricing
} from "../usage/pricing.js";
import { streamViaAiSdk, validateKeyViaModelsEndpoint } from "./shared.js";
import type {
  AIProvider,
  ChatRequest,
  DecryptedKey,
  TokenUsage
} from "./types.js";

/** Direct OpenAI — used when an org has its own key instead of routing through OpenRouter. */
const PRICING: Record<string, ModelPricing> = {
  "gpt-5": { inputPerMTok: 5, outputPerMTok: 15 },
  "gpt-5-mini": { inputPerMTok: 0.5, outputPerMTok: 2 }
};

export function createOpenAIProvider(): AIProvider {
  return {
    id: "openai",

    stream(req: ChatRequest, key: DecryptedKey) {
      const openai = createOpenAI({ apiKey: key.apiKey });
      return streamViaAiSdk(openai(req.model), req);
    },

    model(modelId: string, key: DecryptedKey) {
      return createOpenAI({ apiKey: key.apiKey })(modelId);
    },

    validateKey(key: string) {
      return validateKeyViaModelsEndpoint(
        "https://api.openai.com/v1/models",
        { Authorization: `Bearer ${key}` },
        (body) =>
          Array.isArray((body as { data?: unknown }).data)
            ? (body as { data: { id: string }[] }).data.map((m) => m.id)
            : []
      );
    },

    countCost(usage: TokenUsage, model: string) {
      const pricing = PRICING[model];
      if (!pricing) throw new UnknownModelPricingError(model);
      return creditsForUsage(usage, pricing);
    }
  };
}
