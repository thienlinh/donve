import type { Plugin } from "@puckeditor/core";
import { Sparkles } from "lucide-react";

import {
  AiChatPanel,
  type AiChatPanelProps
} from "../components/ai-chat-panel";

/**
 * Left-nav "AI" tab, same `{ name, label, icon, render }` shape as the Templates plugin next to
 * it (`ai/agent-pipeline.md` §In-canvas chat — a Puck `Plugin` is all the "chat tab inside Puck"
 * idea needs; no `@puckeditor/plugin-ai`, which would route BYOK traffic through Puck Cloud).
 * Built per page rather than declared at module scope because the panel needs this page's id and
 * live document — the same per-page-binding reason `buildConfigFor` exists for `uploadAsset`.
 */
export function createAiPlugin(props: AiChatPanelProps): Plugin {
  return {
    name: "ai",
    label: "AI",
    icon: <Sparkles size={16} />,
    render: () => <AiChatPanel {...props} />
  };
}
