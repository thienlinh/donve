import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputController,
  type PromptInputMessage
} from "@dv/ui/components/ai-elements/prompt-input";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ChatStatus } from "ai";
import {
  ChevronRight,
  LayoutTemplate,
  Megaphone,
  Palette,
  Rocket,
  Users
} from "lucide-react";
import { useState } from "react";

import { fetchOrgSettings } from "@/features/org-settings/api";
import { orgSettingsKeys } from "@/features/org-settings/query-keys";
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
            <BrandKitIndicator />
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

/**
 * Replaces the old decorative "design system: none" dropdown (FR-B-24) — there's only ever one
 * design system per org (the Brand Kit in Settings), always applied server-side, so a picker
 * with nothing to pick from was dead UI. This shows the real status instead: either the brand
 * colors that'll be used, or a link to set them up.
 */
function BrandKitIndicator() {
  const { data } = useQuery({
    queryKey: orgSettingsKeys.all(),
    queryFn: fetchOrgSettings
  });
  const primaryColor = data?.designTokens?.primaryColor;

  if (!primaryColor) {
    return (
      <Link
        to="/settings"
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        <Palette className="size-3.5" />
        {m.landingsNoDesignSystem()}
      </Link>
    );
  }

  return (
    <span className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs text-muted-foreground">
      <span
        className="size-3 rounded-full border"
        style={{ backgroundColor: primaryColor }}
      />
      {m.landingsUsingBrandKit()}
    </span>
  );
}
