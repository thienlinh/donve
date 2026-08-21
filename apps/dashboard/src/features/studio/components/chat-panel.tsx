import { useChat } from "@ai-sdk/react";
import type { PatchOp } from "@dv/studio-core";
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments
} from "@dv/ui/components/ai-elements/attachments";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from "@dv/ui/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse
} from "@dv/ui/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  type PromptInputMessage
} from "@dv/ui/components/ai-elements/prompt-input";
import {
  Suggestion,
  Suggestions
} from "@dv/ui/components/ai-elements/suggestion";
import { Badge } from "@dv/ui/components/shadcn/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import { useQuery } from "@tanstack/react-query";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageSquare, Wand2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import * as m from "@/paraglide/messages.js";

import { chatMessageToUIMessage } from "../chat-adapters";
import { fetchChatMessages } from "../comments-api";
import { chatMessageKeys } from "../query-keys";

function ChatAttachmentsPreview() {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;

  return (
    <Attachments>
      {attachments.files.map((file) => (
        <Attachment
          data={file}
          key={file.id}
          onRemove={() => attachments.remove(file.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
}

/** Successful `apply_patch`/`apply_full_html` tool-call output (ai-integration-byok.md §4). */
type PatchToolOutput = {
  success: true;
  pageVersionId: string;
  summary: string;
};

function isSuccessfulPatchOutput(output: unknown): output is PatchToolOutput {
  return (
    typeof output === "object" &&
    output !== null &&
    (output as { success?: unknown }).success === true
  );
}

type PatchSummaryInfo = { summary: string; pageVersionId: string };

/** Live stream: a `tool-apply_patch`/`tool-apply_full_html` part with a successful output.
 * Reloaded history: the same result, persisted server-side as a `data-patch-summary` part. */
function patchSummaryFromPart(
  part: UIMessage["parts"][number]
): PatchSummaryInfo | null {
  if (part.type === "data-patch-summary") {
    const data = part.data as { pageVersionId: string; summary: string };
    return { summary: data.summary, pageVersionId: data.pageVersionId };
  }
  if (
    (part.type === "tool-apply_patch" ||
      part.type === "tool-apply_full_html") &&
    "output" in part &&
    isSuccessfulPatchOutput(part.output)
  ) {
    return {
      summary: part.output.summary,
      pageVersionId: part.output.pageVersionId
    };
  }
  return null;
}

function ChatMessageItem({
  message,
  onViewVersion
}: {
  message: UIMessage;
  /** Jumps the version-history panel to (and highlights) the version this message's
   * apply_patch/apply_full_html call produced — see studio-page.tsx's cross-panel state. */
  onViewVersion?: (versionId: string) => void;
}) {
  const hasComment = message.parts.some(
    (part) => part.type === "data-comment-context"
  );
  const patchInfo = message.parts
    .map(patchSummaryFromPart)
    .find((info) => info !== null);

  return (
    <Message
      id={`chat-message-${message.id}`}
      from={message.role === "user" ? "user" : "assistant"}
    >
      {hasComment && (
        <Badge className="w-fit gap-1" variant="secondary">
          <MessageSquare className="size-3" />
          {m.studioCommentChatChip()}
        </Badge>
      )}
      {patchInfo && (
        <Badge className="w-fit gap-1" variant="secondary">
          <Wand2 className="size-3" />
          {patchInfo.summary}
        </Badge>
      )}
      {patchInfo && onViewVersion && (
        <button
          type="button"
          className="w-fit text-xs text-primary underline-offset-2 hover:underline"
          onClick={() => onViewVersion(patchInfo.pageVersionId)}
        >
          {m.studioChatViewVersionLink()}
        </button>
      )}
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <MessageContent key={index}>
              <MessageResponse>{part.text}</MessageResponse>
            </MessageContent>
          );
        }
        if (part.type === "file" && part.mediaType.startsWith("image/")) {
          return (
            <img
              alt=""
              className="max-w-full rounded-md border"
              key={index}
              src={part.url}
            />
          );
        }
        return null;
      })}
    </Message>
  );
}

const SUGGESTIONS = [
  m.studioChatSuggestionHeadline,
  m.studioChatSuggestionCta,
  m.studioChatSuggestionMobile
];

export type ChatPanelProps = {
  landingPageId: string;
  /** Applies a successful `apply_patch` tool call's ops the same way Inspector/LayerTree do
   * (commitRef.current per op) — live DOM + undo stack update, no separate write path. */
  onApplyPatch?: (ops: PatchOp[]) => void;
  /** `apply_full_html` replaced the page server-side — caller refetches to pick up the new
   * htmlKey (there's no incremental DOM patch for a full-document replace). */
  onFullHtmlApplied?: () => void;
  /** FR-B-31: fires once as if the user had typed it (the "chuẩn hoá phễu" wizard's banner
   * CTA) — same `sendMessage` path as `handleSuggestion`, just triggered by a prop instead of
   * a click inside this component. `autoPromptSentRef` guards against re-sending the same
   * text on every re-render; the caller clears the prop once handled. */
  autoPrompt?: string | null;
  /** Jumps the version-history panel to (and highlights) the version an assistant message
   * produced — see studio-page.tsx's cross-panel state, same idea as canvas/layer-tree hover. */
  onViewVersion?: (versionId: string) => void;
  /** Set by version-history's "view chat" action — scrolls the matching message into view.
   * Same one-shot-prop pattern as `autoPrompt` above; caller clears it once handled. */
  scrollToMessageId?: string | null;
  onScrollToMessageHandled?: () => void;
};

export function ChatPanel({
  landingPageId,
  onApplyPatch,
  onFullHtmlApplied,
  autoPrompt,
  onViewVersion,
  scrollToMessageId,
  onScrollToMessageHandled
}: ChatPanelProps) {
  const messagesQuery = useQuery({
    queryKey: chatMessageKeys.list(landingPageId),
    queryFn: () => fetchChatMessages(landingPageId)
  });

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${import.meta.env.VITE_API_URL}/api/studio/chat/stream`,
        body: { landingPageId },
        credentials: "include"
      }),
    [landingPageId]
  );

  const { messages, sendMessage, setMessages, status, error } = useChat({
    id: landingPageId,
    transport
  });

  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!hydratedRef.current && messagesQuery.data) {
      setMessages(messagesQuery.data.map(chatMessageToUIMessage));
      hydratedRef.current = true;
    }
  }, [messagesQuery.data, setMessages]);

  // FR-B-22/23: as soon as a tool call's output streams in, mirror it onto the live canvas —
  // `appliedToolCallIds` guards against re-applying the same call on a re-render (and, since
  // reloaded history round-trips through `data-patch-summary` instead of the raw tool part,
  // against ever re-applying it after a page reload).
  const appliedToolCallIds = useRef(new Set<string>());
  useEffect(() => {
    for (const message of messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        if (
          part.type !== "tool-apply_patch" &&
          part.type !== "tool-apply_full_html"
        )
          continue;
        if (!("state" in part) || part.state !== "output-available") continue;
        if (
          !("toolCallId" in part) ||
          appliedToolCallIds.current.has(part.toolCallId)
        )
          continue;
        if (!isSuccessfulPatchOutput(part.output)) continue;
        appliedToolCallIds.current.add(part.toolCallId);

        if (part.type === "tool-apply_patch") {
          const input = part.input as { ops: PatchOp[] } | undefined;
          if (input?.ops) onApplyPatch?.(input.ops);
        } else {
          onFullHtmlApplied?.();
        }
      }
    }
  }, [messages, onApplyPatch, onFullHtmlApplied]);

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      if (!message.text.trim() && message.files.length === 0) return;
      sendMessage(message);
    },
    [sendMessage]
  );

  const handleSuggestion = useCallback(
    (suggestion: string) => sendMessage({ text: suggestion }),
    [sendMessage]
  );

  const autoPromptSentRef = useRef<string | null>(null);
  useEffect(() => {
    if (!autoPrompt || autoPromptSentRef.current === autoPrompt) return;
    autoPromptSentRef.current = autoPrompt;
    sendMessage({ text: autoPrompt });
  }, [autoPrompt, sendMessage]);

  // Version-history's "view chat" action (studio-page.tsx) — jump to the message that
  // produced a given version. `scrollIntoView` needs the message's element already painted,
  // hence the rAF; `onScrollToMessageHandled` clears the one-shot prop once consumed.
  useEffect(() => {
    if (!scrollToMessageId) return;
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(`chat-message-${scrollToMessageId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    onScrollToMessageHandled?.();
    return () => window.cancelAnimationFrame(frame);
  }, [scrollToMessageId, onScrollToMessageHandled]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col border-r">
      {isEmpty ? (
        <Empty className="flex-1 border-none">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquare />
            </EmptyMedia>
            <EmptyTitle>{m.studioChatEmptyTitle()}</EmptyTitle>
            <EmptyDescription>
              {m.studioChatEmptyDescription()}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                onViewVersion={onViewVersion}
              />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      <div className="flex flex-col gap-2 border-t p-3">
        {isEmpty && (
          <Suggestions>
            {SUGGESTIONS.map((suggestion) => (
              <Suggestion
                key={suggestion()}
                onClick={handleSuggestion}
                suggestion={suggestion()}
              />
            ))}
          </Suggestions>
        )}
        {error && <p className="text-xs text-destructive">{error.message}</p>}
        <PromptInput accept="image/*" multiple onSubmit={handleSubmit}>
          <PromptInputHeader>
            <ChatAttachmentsPreview />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea placeholder={m.studioChatPlaceholder()} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
