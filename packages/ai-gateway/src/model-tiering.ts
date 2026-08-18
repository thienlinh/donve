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
