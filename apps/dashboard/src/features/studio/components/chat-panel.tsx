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

/** Live stream: a `tool-apply_patch`/`tool-apply_full_html` part with a successful output.
 * Reloaded history: the same result, persisted server-side as a `data-patch-summary` part. */
function patchSummaryFromPart(part: UIMessage["parts"][number]): string | null {
  if (part.type === "data-patch-summary") {
    return (part.data as { summary: string }).summary;
  }
  if (
    (part.type === "tool-apply_patch" ||
      part.type === "tool-apply_full_html") &&
    "output" in part &&
    isSuccessfulPatchOutput(part.output)
  ) {
    return part.output.summary;
  }
  return null;
}

function ChatMessageItem({ message }: { message: UIMessage }) {
  const hasComment = message.parts.some(
    (part) => part.type === "data-comment-context"
  );
  const patchSummary = message.parts
    .map(patchSummaryFromPart)
    .find((summary) => summary !== null);

  return (
    <Message from={message.role === "user" ? "user" : "assistant"}>
      {hasComment && (
        <Badge className="w-fit gap-1" variant="secondary">
          <MessageSquare className="size-3" />
          {m.studioCommentChatChip()}
        </Badge>
      )}
      {patchSummary && (
        <Badge className="w-fit gap-1" variant="secondary">
          <Wand2 className="size-3" />
          {patchSummary}
        </Badge>
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
};

export function ChatPanel({
  landingPageId,
  onApplyPatch,
  onFullHtmlApplied
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
              <ChatMessageItem key={message.id} message={message} />
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
