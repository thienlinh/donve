import type { ByokProviderId } from "./providers/types.js";

export type AiUseCase = "generate" | "patch";

/**
 * Cheap tier for small patches / layer naming (ai-integration-byok.md §6): DeepSeek via
 * OpenRouter, Haiku for the direct-key providers. The strong-model tier for a first
 * generate is just whatever the connection's own `defaultModel` is — no separate table.
 */
const CHEAP_MODEL: Record<ByokProviderId, string> = {
  openrouter: "deepseek/deepseek-chat-v3",
  anthropic: "claude-haiku-4-5",
  openai: "gpt-5-mini"
};

/** Picks which model a request should actually use, given the connection's own default. */
export function pickModel(
  provider: ByokProviderId,
  useCase: AiUseCase,
  connectionDefaultModel: string
): string {
  return useCase === "generate"
    ? connectionDefaultModel
    : CHEAP_MODEL[provider];
}

/**
 * Output token budget per use case — a full single-file HTML document (FR-B-21) needs far
 * more headroom than a small patch/layer-naming call. Left unset, providers fall back to
 * their own default, which for Workers AI's trial models is low enough to cut a generated
 * page off mid-`<style>` block with no `<body>` at all (confirmed live on staging).
 */
const MAX_OUTPUT_TOKENS: Record<AiUseCase, number> = {
  generate: 8000,
  patch: 2000
};

export function pickMaxOutputTokens(useCase: AiUseCase): number {
  return MAX_OUTPUT_TOKENS[useCase];
}
