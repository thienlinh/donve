import { createOpenAI } from "@ai-sdk/openai";

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

const BASE_URL = "https://api.groq.com/openai/v1";

/** Groq's OpenAI-compatible endpoint — free-tier dev keys, no billing to the platform. */
const PRICING: Record<string, ModelPricing> = {
  "llama-3.1-8b-instant": { inputPerMTok: 0, outputPerMTok: 0 },
  "llama-3.3-70b-versatile": { inputPerMTok: 0, outputPerMTok: 0 }
};

export function createGroqProvider(): AIProvider {
  return {
    id: "groq",

    // `.chat(modelId)` specifically, not the bare factory call — that defaults to OpenAI's
    // newer Responses API (POST /v1/responses), which Groq doesn't implement (only the classic
    // Chat Completions API, like every other OpenAI-compatible third-party endpoint).
    stream(req: ChatRequest, key: DecryptedKey) {
      const groq = createOpenAI({ apiKey: key.apiKey, baseURL: BASE_URL });
      return streamViaAiSdk(groq.chat(req.model), req);
    },

    model(modelId: string, key: DecryptedKey) {
      return createOpenAI({ apiKey: key.apiKey, baseURL: BASE_URL }).chat(
        modelId
      );
    },

    validateKey(key: string) {
      // Groq hosts models from multiple labs (Meta, Google, OpenAI, Groq itself) — `owned_by`
      // genuinely varies per model here, unlike OpenAI's own endpoint.
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
      return countCostFromPricing(PRICING, usage, model);
    }
  };
}
