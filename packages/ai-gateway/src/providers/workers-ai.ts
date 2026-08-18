import type { AIProvider, ChatRequest, StreamPart } from "./types.js";

/**
 * Minimal structural subset of Cloudflare's global `Ai` binding, declared locally so this
 * package has no build-time coupling to `@cloudflare/workers-types` (same reasoning as
 * `packages/drivers/src/storage/r2.ts`'s `R2BucketBinding`) — the real binding satisfies
 * this structurally at the call site in apps/api.
 */
export interface WorkersAiBinding {
  run(
    model: string,
    input: {
      messages: { role: string; content: string }[];
      max_tokens?: number;
    }
  ): Promise<{ response?: string } | ReadableStream>;
}

/** Free-tier text model used for the FR-H-05 no-BYOK trial — Llama, not Gemini (ai-integration-byok.md §6). */
export const WORKERS_AI_TRIAL_MODEL = "@cf/meta/llama-3.1-8b-instruct";

/**
 * Trial-only provider backing FR-H-05: no API key, billed as a Workers AI request against
 * the platform's own CF account, gated by `organizations.trialUsesRemaining` instead of
 * `aiCreditBalance`. Only constructible where `env.AI` exists (CF Workers runtime).
 */
export function createWorkersAiProvider(ai: WorkersAiBinding): AIProvider {
  return {
    id: "workers-ai",

    async *stream(req: ChatRequest): AsyncIterable<StreamPart> {
      try {
        const result = await ai.run(req.model, {
          messages: req.messages,
          max_tokens: req.maxOutputTokens
        });
        const text =
          typeof result === "object" && result !== null && "response" in result
            ? (result.response ?? "")
            : "";
        yield { type: "text-delta", text };
        yield {
          type: "finish",
          usage: { inputTokens: 0, outputTokens: 0 },
          finishReason: "stop"
        };
      } catch (err) {
        yield {
          type: "error",
          error: err instanceof Error ? err.message : String(err)
        };
      }
    },

    // Workers AI isn't an AI-SDK provider (raw CF binding, no LanguageModel) — nothing to hand
    // callers driving `streamText` themselves. Trial mode doesn't need live chat streaming yet.
    model(): never {
      throw new Error(
        "workers-ai provider has no LanguageModel — use stream() instead"
      );
    },

    // Trial mode never takes a user-supplied key — there's nothing to validate.
    validateKey: () =>
      Promise.resolve({ ok: true, models: [WORKERS_AI_TRIAL_MODEL] }),

    // Trial usage is never billed in credits (packages/db ai-credits.ts debits trialUsesRemaining instead).
    countCost: () => 0
  };
}
