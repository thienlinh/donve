import { useChat } from "@ai-sdk/react";
import type { NativePageDocument } from "@dv/contracts";
import { pageSpecToPuckData, puckDataToPageSpec } from "@dv/studio-catalog";
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
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage
} from "@dv/ui/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger
} from "@dv/ui/components/ai-elements/reasoning";
import {
  Suggestion,
  Suggestions
} from "@dv/ui/components/ai-elements/suggestion";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput
} from "@dv/ui/components/ai-elements/tool";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import type { Spec } from "@json-render/core";
import { createUsePuck } from "@puckeditor/core";
import { useQuery } from "@tanstack/react-query";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react";

import { ConnectAiDialog } from "@/features/ai-connections/components/connect-ai-dialog";
import * as m from "@/paraglide/messages.js";

import {
  chatErrorCopy,
  chatMessageToUIMessage
} from "../../studio/chat-adapters";
import { fetchChatMessages } from "../../studio/comments-api";
import { chatMessageKeys } from "../../studio/query-keys";

const useTypedPuck = createUsePuck();

const TOOL_PART_TYPE = "tool-apply_page_patch";

/** Successful `apply_page_patch` output — `pageSpec` is the server's own post-guardrail result
 * (`restoreSensitiveProps` already applied), which is why the canvas re-renders from it rather
 * than replaying the ops client-side. */
type PagePatchOutput = {
  success: true;
  pageVersionId: string;
  summary: string;
  pageSpec: NativePageDocument["pageSpec"];
};

function successfulPatchOutput(output: unknown): PagePatchOutput | null {
  if (typeof output !== "object" || output === null) return null;
  const candidate = output as Partial<PagePatchOutput>;
  return candidate.success === true && candidate.pageSpec
    ? (candidate as PagePatchOutput)
    : null;
}

function ToolCallPart({ part }: { part: UIMessage["parts"][number] }) {
  if (!("state" in part)) return null;
  const output = "output" in part ? successfulPatchOutput(part.output) : null;

  return (
    <Tool>
      <ToolHeader
        title={m.studioNativeChatToolTitle()}
        type={TOOL_PART_TYPE}
        state={part.state as "output-available"}
      />
      <ToolContent>
        <ToolInput input={"input" in part ? part.input : undefined} />
        <ToolOutput
          output={output ? <p>{output.summary}</p> : undefined}
          errorText={"errorText" in part ? part.errorText : undefined}
        />
      </ToolContent>
    </Tool>
  );
}

function ChatMessageItem({ message }: { message: UIMessage }) {
  return (
    <Message from={message.role === "user" ? "user" : "assistant"}>
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <MessageContent key={index}>
              <MessageResponse>{part.text}</MessageResponse>
            </MessageContent>
          );
        }
        if (part.type === "reasoning") {
          return (
            <Reasoning key={index} className="w-full">
              <ReasoningTrigger />
              <ReasoningContent>{part.text}</ReasoningContent>
            </Reasoning>
          );
        }
        if (part.type === TOOL_PART_TYPE) {
          return <ToolCallPart key={index} part={part} />;
        }
        // Reloaded history: the tool call comes back as the persisted `patch-summary` part.
        if (part.type === "data-patch-summary") {
          const data = part.data as { summary: string };
          return (
            <MessageContent key={index}>
              <MessageResponse>{data.summary}</MessageResponse>
            </MessageContent>
          );
        }
        return null;
      })}
    </Message>
  );
}

const SUGGESTIONS = [
  m.studioNativeChatSuggestionHeadline,
  m.studioNativeChatSuggestionTestimonial,
  m.studioNativeChatSuggestionTone
];

export interface AiChatPanelProps {
  landingPageId: string;
  /** The live document envelope (tokens/SEO + the spec Puck was seeded from). Read at send
   * time only — a ref, not a prop value, so canvas edits don't re-render the whole panel. */
  documentRef: RefObject<NativePageDocument | null>;
}

/**
 * In-canvas AI chat for the native Studio, as a Puck left-nav tab (`ai/agent-pipeline.md`
 * §In-canvas chat). Mirrors the legacy srcmap `ChatPanel` (same history endpoint, same
 * `useChat` transport shape, same `appliedToolCallIds` guard) but speaks PageSpec ops and
 * writes results straight into Puck's own state — so every AI change lands in Puck's undo
 * stack exactly like a hand edit.
 */
export function AiChatPanel({ landingPageId, documentRef }: AiChatPanelProps) {
  const dispatch = useTypedPuck((s) => s.dispatch);
  const puckData = useTypedPuck((s) => s.appState.data);

  const messagesQuery = useQuery({
    queryKey: chatMessageKeys.list(landingPageId),
    queryFn: () => fetchChatMessages(landingPageId)
  });

  // `landingPageId`/`document` ride on each `sendMessage` call instead of the transport's
  // static `body` — the document has to be read at send time, not at mount time.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${import.meta.env.VITE_API_URL}/api/studio/native-chat/stream`,
        credentials: "include"
      }),
    []
  );

  const { messages, sendMessage, setMessages, status, error } = useChat({
    // Distinct from the legacy panel's `useChat({ id: landingPageId })` store — same page, a
    // different patch vocabulary, and they must never share an in-flight message list.
    id: `native:${landingPageId}`,
    transport
  });

  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!hydratedRef.current && messagesQuery.data) {
      setMessages(messagesQuery.data.map(chatMessageToUIMessage));
      hydratedRef.current = true;
    }
  }, [messagesQuery.data, setMessages]);

  // As soon as a tool call's output streams in, mirror it onto the live canvas.
  // `appliedToolCallIds` guards against re-applying the same call on a re-render (and, since
  // reloaded history round-trips through `data-patch-summary` instead of the raw tool part,
  // against ever re-applying it after a reload).
  const appliedToolCallIds = useRef(new Set<string>());
  useEffect(() => {
    for (const message of messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        if (part.type !== TOOL_PART_TYPE) continue;
        if (!("state" in part) || part.state !== "output-available") continue;
        if (
          !("toolCallId" in part) ||
          appliedToolCallIds.current.has(part.toolCallId)
        )
          continue;
        const output = successfulPatchOutput(part.output);
        if (!output) continue;
        appliedToolCallIds.current.add(part.toolCallId);

        const next = pageSpecToPuckData(output.pageSpec as unknown as Spec);
        // Same dispatch shape as the Templates panel's `applyTemplate`, so the change goes
        // through Puck's own history (undoable) instead of remounting the editor.
        dispatch({
          type: "setData",
          data: (prev) => ({ ...prev, content: next.content })
        });
      }
    }
  }, [messages, dispatch]);

  const send = useCallback(
    (text: string) => {
      const envelope = documentRef.current;
      // `ai/agent-pipeline.md` §Quyết định đã chốt #1 — the patch is based on what the user is
      // looking at right now (Puck's live state), not on the last manually saved version.
      const document =
        envelope && puckData
          ? {
              ...envelope,
              pageSpec: puckDataToPageSpec(
                puckData,
                envelope.pageSpec as unknown as Spec
              )
            }
          : undefined;
      sendMessage({ text }, { body: { landingPageId, document } });
    },
    [sendMessage, documentRef, landingPageId, puckData]
  );

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      if (!message.text.trim()) return;
      send(message.text);
    },
    [send]
  );

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {isEmpty ? (
        <Empty className="flex-1 border-none">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Sparkles />
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
                onClick={send}
                suggestion={suggestion()}
              />
            ))}
          </Suggestions>
        )}
        {error &&
          (() => {
            const copy = chatErrorCopy(error.message);
            return copy ? (
              <div className="flex flex-col gap-1 text-xs">
                <p className="font-medium text-destructive">{copy.title}</p>
                <p className="text-muted-foreground">{copy.description}</p>
                <ConnectAiDialog />
              </div>
            ) : (
              <p className="text-xs text-destructive">{error.message}</p>
            );
          })()}
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea placeholder={m.studioChatPlaceholder()} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
