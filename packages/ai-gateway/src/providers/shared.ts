import { streamText } from "ai";

import type {
  ChatRequest,
  LanguageModelLike,
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
      temperature: req.temperature
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
 * Collects a provider's stream into one response — apps/api's `/api/ai/generate` (v1) returns
 * a plain JSON response rather than proxying token-by-token SSE to the dashboard.
 * // ponytail: no live streaming to the client yet, add an SSE passthrough if the UI needs typing-effect output.
 */
export async function collectStream(
  stream: AsyncIterable<StreamPart>
): Promise<{ text: string; usage: TokenUsage }> {
  let text = "";
  let usage: TokenUsage = { inputTokens: 0, outputTokens: 0 };
  for await (const part of stream) {
    if (part.type === "text-delta") text += part.text;
    else if (part.type === "finish") usage = part.usage;
    else if (part.type === "error") throw new Error(part.error);
  }
  return { text, usage };
}

/** Validates a key by fetching the provider's models endpoint directly — no plaintext logging. */
export async function validateKeyViaModelsEndpoint(
  url: string,
  headers: Record<string, string>,
  extractModelIds: (body: unknown) => string[]
): Promise<{ ok: boolean; models: string[] }> {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return { ok: false, models: [] };
    const models = extractModelIds(await res.json());
    return { ok: true, models };
  } catch {
    return { ok: false, models: [] };
  }
}
