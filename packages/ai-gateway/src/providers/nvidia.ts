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
  ModelOption,
  TokenUsage
} from "./types.js";

const BASE_URL = "https://integrate.api.nvidia.com/v1";

/** NVIDIA NIM's OpenAI-compatible endpoint — free-tier dev keys, no billing to the platform. */
const PRICING: Record<string, ModelPricing> = {
  "meta/llama-3.1-8b-instruct": { inputPerMTok: 0, outputPerMTok: 0 },
  "meta/llama-3.3-70b-instruct": { inputPerMTok: 0, outputPerMTok: 0 }
};

export function createNvidiaProvider(): AIProvider {
  return {
    id: "nvidia",

    // `.chat(modelId)` specifically, not the bare factory call — that defaults to OpenAI's
    // newer Responses API (POST /v1/responses), which NVIDIA NIM doesn't implement (only the
    // classic Chat Completions API, like every other OpenAI-compatible third-party endpoint).
    stream(req: ChatRequest, key: DecryptedKey) {
      const nvidia = createOpenAI({ apiKey: key.apiKey, baseURL: BASE_URL });
      return streamViaAiSdk(nvidia.chat(req.model), req);
    },

    model(modelId: string, key: DecryptedKey) {
      return createOpenAI({ apiKey: key.apiKey, baseURL: BASE_URL }).chat(
        modelId
      );
    },

    validateKey(key: string) {
      // NVIDIA's catalog spans many labs (01-ai, Meta, Google, Mistral, NVIDIA itself, ...) —
      // `owned_by` genuinely varies per model (confirmed against the live public catalog).
      return validateKeyViaModelsEndpoint(
        `${BASE_URL}/models`,
        { Authorization: `Bearer ${key}` },
        (body): ModelOption[] =>
          Array.isArray((body as { data?: unknown }).data)
            ? (body as { data: { id: string; owned_by?: string }[] }).data.map(
                (m) => ({
                  id: m.id,
                  description: m.owned_by ? `by ${m.owned_by}` : undefined
                })
              )
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
