import { decryptApiKey, getProvider } from "@dv/ai-gateway";
import type { ChatContentPart } from "@dv/contracts";
import {
  aiConnectionsRepository,
  chatSessionsRepository,
  landingPagesRepository
} from "@dv/db";
import type { UIMessage } from "ai";

import type { Bindings } from "../types.js";
import { importAiMasterKeyFromEnv } from "./ai-gateway.js";
import type { createDbFromEnv } from "./db.js";
import { ApiError } from "./errors.js";

export async function requireLandingPage(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  landingPageId: string
) {
  const landingPage = await landingPagesRepository.findById(
    db,
    orgId,
    landingPageId
  );
  if (!landingPage || landingPage.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }
  return landingPage;
}

/** Comments/chat are per-page and each page has at most one chat session — create it lazily. */
export async function requireChatSessionId(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  landingPage: NonNullable<Awaited<ReturnType<typeof requireLandingPage>>>
): Promise<string> {
  if (landingPage.chatSessionId) return landingPage.chatSessionId;
  const session = await chatSessionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    title: null
  });
  if (!session) throw new ApiError(500, "chat_session_create_failed");
  await landingPagesRepository.update(db, orgId, landingPage.id, {
    chatSessionId: session.id
  });
  return session.id;
}

/**
 * The streaming model behind both Studio chats (legacy srcmap + native PageSpec).
 * ponytail: BYOK-only (no trial/platform routing like `/api/ai/generate`) — neither chat panel
 * has a connection picker, so both just require a default BYOK connection to be connected.
 */
export async function resolveChatModel(
  db: ReturnType<typeof createDbFromEnv>,
  env: Bindings,
  orgId: string
) {
  const connections = await aiConnectionsRepository.list(db, orgId);
  const connection = connections.find((row) => row.isDefault);
  if (!connection?.encryptedKey || connection.provider === "platform") {
    throw new ApiError(400, "no_ai_connection");
  }
  const masterKey = await importAiMasterKeyFromEnv(env);
  const apiKey = await decryptApiKey(connection.encryptedKey, masterKey);
  return getProvider(connection.provider).model(connection.defaultModel, {
    apiKey
  });
}

/** Successful patch-tool output — same envelope for legacy `apply_patch`/`apply_full_html`
 * and the native Studio's `apply_page_patch` (`ai-integration/byok.md` §4). */
export function isSuccessfulPatchOutput(
  output: unknown
): output is { success: true; pageVersionId: string; summary: string } {
  return (
    typeof output === "object" &&
    output !== null &&
    (output as { success?: unknown }).success === true
  );
}

/** AI SDK `UIMessage` parts → our stored `ChatContentPart[]` (comment-context parts don't
 * round-trip; any successful patch tool result becomes a `patch-summary` part). */
export function uiMessageToChatContent(message: UIMessage): ChatContentPart[] {
  const parts: ChatContentPart[] = [];
  for (const part of message.parts) {
    if (part.type === "text") {
      parts.push({ type: "text", text: part.text });
    } else if (part.type === "file" && part.mediaType.startsWith("image/")) {
      parts.push({ type: "image", url: part.url });
    } else if (
      part.type.startsWith("tool-") &&
      "output" in part &&
      isSuccessfulPatchOutput(part.output)
    ) {
      parts.push({
        type: "patch-summary",
        pageVersionId: part.output.pageVersionId,
        summary: part.output.summary
      });
    }
  }
  return parts;
}
