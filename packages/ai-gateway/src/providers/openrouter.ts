import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import {
  creditsForUsage,
  UnknownModelPricingError,
  type ModelPricing
} from "../usage/pricing.js";
import {
  formatTokenCount,
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

/** OpenRouter's `/models` response includes real pricing + context length per model — the
 * only one of our five providers whose `/models` endpoint carries enough to build a useful,
 * non-fabricated one-line description for the connect dialog's model picker. */
interface OpenRouterModel {
  id: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string };
}

function describeOpenRouterModel(model: OpenRouterModel): string | undefined {
  const promptPrice = Number(model.pricing?.prompt ?? 0);
  const completionPrice = Number(model.pricing?.completion ?? 0);
  // OpenRouter's own convention for its dynamic auto-router models (openrouter/auto and
  // friends): a "-1" sentinel means "routed per-request, price depends on the model picked" —
  // not a real negative price.
  const isVariable = promptPrice < 0 || completionPrice < 0;
  const isFree = promptPrice === 0 && completionPrice === 0;
  const priceLabel = isVariable
    ? "Variable pricing"
    : isFree
      ? "Free"
      : `$${(promptPrice * 1_000_000).toFixed(2)}/$${(completionPrice * 1_000_000).toFixed(2)} per 1M tok`;
  const contextLabel = model.context_length
    ? `${formatTokenCount(model.context_length)} context`
    : undefined;
  return [priceLabel, contextLabel].filter(Boolean).join(" · ");
}

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
        (body): ModelOption[] =>
          Array.isArray((body as { data?: unknown }).data)
            ? (body as { data: OpenRouterModel[] }).data.map((m) => ({
                id: m.id,
                description: describeOpenRouterModel(m)
              }))
            : []
      );
    },

    countCost(usage: TokenUsage, model: string) {
      // OpenRouter's own naming convention: any model id ending in ":free" (or the literal
      // "openrouter/free" auto-router) is zero-cost. Checking this pattern instead of requiring
      // every one of OpenRouter's many free-tier ids in the static PRICING table below is the
      // difference between "just works" and a real incident — a user hit this leaving a genuine
      // 5-minute generation with `openrouter/free` throwing `UnknownModelPricingError` at the
      // very last step, discarding the completed output.
      if (model.endsWith(":free") || model === "openrouter/free") return 0;
      const pricing = PRICING[model];
      if (!pricing) throw new UnknownModelPricingError(model);
      return creditsForUsage(usage, pricing);
    }
  };
}
