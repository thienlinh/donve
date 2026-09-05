import type { streamText } from "ai";

/**
 * Provider abstraction boundary (ai-integration-byok.md §2). Every concrete
 * provider (OpenRouter/Anthropic/OpenAI) implements this same interface so the
 * caller never branches on provider id outside of `createProvider`.
 */

/** Structural subset of AI SDK's `LanguageModel` — enough to drive `streamText`. */
export type LanguageModelLike = Parameters<typeof streamText>[0]["model"];

/** BYOK providers plus "workers-ai" — the platform-key provider behind the no-BYOK trial (FR-H-05). */
export type ProviderId =
  | "openrouter"
  | "anthropic"
  | "openai"
  | "groq"
  | "nvidia"
  | "workers-ai";

/** The subset of ProviderId a tenant can actually connect a key for (registry.ts). */
export type ByokProviderId =
  | "openrouter"
  | "anthropic"
  | "openai"
  | "groq"
  | "nvidia";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  maxOutputTokens?: number;
  temperature?: number;
}

/** A BYOK key already decrypted by the caller via key-vault.ts — providers never see ciphertext. */
export interface DecryptedKey {
  apiKey: string;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

/** Integer credits, matching `aiUsage.creditCost` (database-schema.md). */
export type Credits = number;

/** Transient/model-shaped failure a caller can show the user a specific message for, instead
 * of a generic "something went wrong" — see `classifyAiStreamError` in shared.ts. */
export type AiErrorCode =
  | "rate_limited"
  | "overloaded"
  | "model_unavailable"
  | "no_output";

export type StreamPart =
  | { type: "text-delta"; text: string }
  | { type: "finish"; usage: TokenUsage; finishReason: string }
  | { type: "error"; error: string; code?: AiErrorCode };

/** One selectable model, with a short human-readable hint when the provider's `/models`
 * response actually carries one (OpenRouter: pricing + context; others: `owned_by`/
 * `display_name` if present) — never fabricated for providers that don't supply it. */
export interface ModelOption {
  id: string;
  description?: string;
}

export interface ValidateKeyResult {
  ok: boolean;
  models: ModelOption[];
}

export interface AIProvider {
  readonly id: ProviderId;
  stream(req: ChatRequest, key: DecryptedKey): AsyncIterable<StreamPart>;
  /** Raw `LanguageModel` for callers driving `streamText` themselves (e.g. live chat streaming to the client). */
  model(modelId: string, key: DecryptedKey): LanguageModelLike;
  validateKey(key: string): Promise<ValidateKeyResult>;
  /** Cost of one request's usage on the given model, in integer credits. */
  countCost(usage: TokenUsage, model: string): Credits;
}
