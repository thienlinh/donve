import type { ChatMessage } from "@dv/contracts";
import type { UIMessage } from "ai";

import * as m from "@/paraglide/messages.js";

function guessImageMediaType(url: string): string {
  const match = /^data:([^;]+);/.exec(url);
  return match?.[1] ?? "image/png";
}

/** Same three `ApiError` codes `apps/api/src/lib/ai-gateway.ts`/`studio-chat.ts` throw for a
 * blocked generation, mapped to the chat's own friendly copy — `useChat`'s `error.message` is
 * the raw JSON response body (`{"error":{"code":...}}`), not something safe to render as-is. */
export function chatErrorCopy(
  message: string
): { title: string; description: string } | null {
  let code = message;
  try {
    code =
      (JSON.parse(message) as { error?: { code?: string } }).error?.code ??
      message;
  } catch {
    // Not JSON (network error, etc.) — fall through to the raw message as `code`.
  }
  switch (code) {
    case "no_ai_connection":
      return {
        title: m.studioGenerateErrorNoAiConnectionTitle(),
        description: m.studioGenerateErrorNoAiConnectionDescription()
      };
    case "trial_exhausted":
      return {
        title: m.studioGenerateErrorTrialExhaustedTitle(),
        description: m.studioGenerateErrorTrialExhaustedDescription()
      };
    case "insufficient_credits":
      return {
        title: m.studioGenerateErrorInsufficientCreditsTitle(),
        description: m.studioGenerateErrorInsufficientCreditsDescription()
      };
    default:
      return null;
  }
}

/** DB-stored `ChatMessage` → AI SDK `UIMessage`, so history and live-streamed turns render the same way. */
export function chatMessageToUIMessage(message: ChatMessage): UIMessage {
  const parts: UIMessage["parts"] = [];
  for (const part of message.content) {
    if (part.type === "text") {
      parts.push({ type: "text", text: part.text });
    } else if (part.type === "image") {
      parts.push({
        type: "file",
        mediaType: guessImageMediaType(part.url),
        url: part.url
      });
    } else if (part.type === "comment-context") {
      parts.push({
        type: "data-comment-context",
        data: { commentId: part.commentId, srcmapId: part.srcmapId }
      });
    } else if (part.type === "patch-summary") {
      parts.push({
        type: "data-patch-summary",
        data: { pageVersionId: part.pageVersionId, summary: part.summary }
      });
    }
  }
  return {
    id: message.id,
    role: message.role === "tool" ? "assistant" : message.role,
    parts
  };
}
