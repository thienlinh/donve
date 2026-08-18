import { createOpenRouter } from "@openrouter/ai-sdk-provider";

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

/**
 * OpenRouter is the v1 default provider (ai-integration-byok.md §1.3): one key,
 * pass-through access to DeepSeek/Qwen/Llama/Claude/GPT, free models to test with
 * before paying a direct Anthropic/OpenAI bill.
 */
const PRICING: Record<string, ModelPricing> = {
  "deepseek/deepseek-chat-v3": { inputPerMTok: 0.27, outputPerMTok: 1.1 },
  "deepseek/deepseek-chat-v3:free": { inputPerMTok: 0, outputPerMTok: 0 },
  "anthropic/claude-sonnet-4.5": { inputPerMTok: 3, outputPerMTok: 15 },
  "anthropic/claude-haiku-4.5": { inputPerMTok: 1, outputPerMTok: 5 }
};

export function createOpenRouterProvider(): AIProvider {
  return {
    id: "openrouter",

    stream(req: ChatRequest, key: DecryptedKey) {
      const openrouter = createOpenRouter({ apiKey: key.apiKey });
      return streamViaAiSdk(openrouter(req.model), req);
    },

    model(modelId: string, key: DecryptedKey) {
      return createOpenRouter({ apiKey: key.apiKey })(modelId);
    },

    validateKey(key: string) {
      return validateKeyViaModelsEndpoint(
        "https://openrouter.ai/api/v1/models",
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
