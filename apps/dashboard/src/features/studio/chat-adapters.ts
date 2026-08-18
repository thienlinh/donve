import type { ChatMessage } from "@dv/contracts";
import type { UIMessage } from "ai";

function guessImageMediaType(url: string): string {
  const match = /^data:([^;]+);/.exec(url);
  return match?.[1] ?? "image/png";
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
