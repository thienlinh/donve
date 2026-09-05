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
  openai: "gpt-5-mini",
  // ponytail: same story as nvidia below — `llama-3.1-8b-instant` no longer exists on Groq's
  // catalog (`model_not_found` against a real key); `qwen/qwen3.8-27b` confirmed working and
  // returning clean JSON (not split into a separate `reasoning` field the way Groq's own
  // `openai/gpt-oss-*` models do, which breaks callers that expect the JSON in `content`).
  groq: "qwen/qwen3.8-27b",
  // ponytail: NVIDIA NIM's `meta/*` third-party mirrors get discontinued on NVIDIA's own
  // schedule (the previous entry, `meta/llama-3.1-8b-instruct`, went EOL 2026-08-26 with a
  // hard 410 from their API) and per-key model entitlements vary (a given free dev key may
  // 404 on models the live model-picker lists). `nvidia/*`-namespaced models are NVIDIA's own
  // and were the ones that actually worked against a real free-tier key when this was last
  // verified — if this starts 404ing/410ing again, re-verify against a real key rather than
  // guessing a replacement id.
  nvidia: "nvidia/nemotron-3-nano-30b-a3b"
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
