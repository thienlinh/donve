import { streamText } from "ai";

import {
  creditsForUsage,
  UnknownModelPricingError,
  type ModelPricing
} from "../usage/pricing.js";
import type {
  ChatRequest,
  Credits,
  LanguageModelLike,
  ModelOption,
  StreamPart,
  TokenUsage
} from "./types.js";

/** Shared `streamText` → `StreamPart` adapter used by every concrete provider. */
export async function* streamViaAiSdk(
  model: LanguageModelLike,
  req: ChatRequest
): AsyncIterable<StreamPart> {
  try {
    const result = streamText({
      model,
      messages: req.messages,
      maxOutputTokens: req.maxOutputTokens,
      temperature: req.temperature,
      // `messages` always leads with a system-role entry (the compiled generate/patch prompt)
      // — the AI SDK rejects that by default ("System messages are not allowed in the prompt
      // or messages fields. Use the instructions option instead"), which threw for every
      // provider that goes through this shared adapter (never actually surfaced before now,
      // since no BYOK/platform connection had made it through a full generate call live).
      allowSystemInMessages: true
    });

    for await (const text of result.textStream) {
      yield { type: "text-delta", text };
    }

    const [usage, finishReason] = await Promise.all([
      result.usage,
      result.finishReason
    ]);
    yield {
      type: "finish",
      usage: {
        inputTokens: usage.inputTokens ?? 0,
        outputTokens: usage.outputTokens ?? 0
      },
      finishReason
    };
  } catch (err) {
    yield {
      type: "error",
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

/**
 * Collects a provider's stream into one response. `onTextDelta`, when given, is called with
 * each chunk as it arrives — lets a caller relay live progress (e.g. as SSE to the browser)
 * without duplicating the accumulation/usage/error handling below.
 */
export async function collectStream(
  stream: AsyncIterable<StreamPart>,
  onTextDelta?: (text: string) => void | Promise<void>
): Promise<{ text: string; usage: TokenUsage }> {
  let text = "";
  let usage: TokenUsage = { inputTokens: 0, outputTokens: 0 };
  for await (const part of stream) {
    if (part.type === "text-delta") {
      text += part.text;
      // Awaited so a slow downstream sink (e.g. writing an SSE chunk to the browser)
      // backpressures the provider stream instead of racing ahead of it.
      await onTextDelta?.(part.text);
    } else if (part.type === "finish") usage = part.usage;
    else if (part.type === "error") throw new Error(part.error);
  }
  return { text, usage };
}

/** Short "262K"/"1M" style label for a context window — used in model-picker descriptions. */
export function formatTokenCount(count: number): string {
  if (count >= 1_000_000) {
    const millions = count / 1_000_000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`;
  }
  if (count >= 1_000) return `${Math.round(count / 1_000)}K`;
  return String(count);
}

/** Shared `countCost` body for providers with a flat per-model pricing table (all but OpenRouter,
 * which has an extra free-tier branch). Throws if `model` has no entry — billing must never
 * silently under-count. */
export function countCostFromPricing(
  pricing: Record<string, ModelPricing>,
  usage: TokenUsage,
  model: string
): Credits {
  const modelPricing = pricing[model];
  if (!modelPricing) throw new UnknownModelPricingError(model);
  return creditsForUsage(usage, modelPricing);
}

/** Validates a key by fetching the provider's models endpoint directly — no plaintext logging. */
export async function validateKeyViaModelsEndpoint(
  url: string,
  headers: Record<string, string>,
  extractModels: (body: unknown) => ModelOption[]
): Promise<{ ok: boolean; models: ModelOption[] }> {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return { ok: false, models: [] };
    const models = extractModels(await res.json());
    return { ok: true, models };
  } catch {
    return { ok: false, models: [] };
  }
}
