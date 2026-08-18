import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputController,
  type PromptInputMessage
} from "@dv/ui/components/ai-elements/prompt-input";
import type { ChatStatus } from "ai";
import {
  ChevronRight,
  LayoutTemplate,
  Megaphone,
  Rocket,
  Users
} from "lucide-react";
import { useState } from "react";

import * as m from "@/paraglide/messages.js";

const POPULAR_TASKS = [
  { icon: Rocket, label: () => m.landingsPopularTaskProductLaunch() },
  { icon: Megaphone, label: () => m.landingsPopularTaskPromotion() },
  { icon: Users, label: () => m.landingsPopularTaskLeadCapture() },
  { icon: LayoutTemplate, label: () => m.landingsPopularTaskPortfolio() }
];

export function LandingPromptBar({
  onSubmit
}: {
  onSubmit: (prompt: string) => void | Promise<void>;
}) {
  return (
    <PromptInputProvider>
      <PromptBarInner onSubmit={onSubmit} />
    </PromptInputProvider>
  );
}

function PromptBarInner({
  onSubmit
}: {
  onSubmit: (prompt: string) => void | Promise<void>;
}) {
  const controller = usePromptInputController();
  const [status, setStatus] = useState<ChatStatus | undefined>(undefined);

  async function handleSubmit(message: PromptInputMessage) {
    const text = message.text.trim();
    if (!text) return;
    setStatus("submitted");
    try {
      await onSubmit(text);
    } finally {
      setStatus(undefined);
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputBody>
          <PromptInputTextarea placeholder={m.landingsPromptPlaceholder()} />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputSelect defaultValue="none">
              <PromptInputSelectTrigger>
                <PromptInputSelectValue />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                <PromptInputSelectItem value="none">
                  {m.landingsNoDesignSystem()}
                </PromptInputSelectItem>
              </PromptInputSelectContent>
            </PromptInputSelect>
          </PromptInputTools>
          <PromptInputSubmit
            status={status}
            disabled={status === "submitted"}
          />
        </PromptInputFooter>
      </PromptInput>

      <div className="flex flex-col">
        {POPULAR_TASKS.map(({ icon: Icon, label }) => (
          <button
            key={label()}
            type="button"
            onClick={() => controller.textInput.setInput(label())}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-start text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Icon className="size-4" />
            <span className="flex-1">{label()}</span>
            <ChevronRight className="size-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
