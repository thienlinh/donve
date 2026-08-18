import { createAnthropicProvider } from "./anthropic.js";
import { createOpenAIProvider } from "./openai.js";
import { createOpenRouterProvider } from "./openrouter.js";
import type { AIProvider, ByokProviderId } from "./types.js";

const providers: Record<ByokProviderId, AIProvider> = {
  openrouter: createOpenRouterProvider(),
  anthropic: createAnthropicProvider(),
  openai: createOpenAIProvider()
};

/** Looks up the concrete provider for `aiConnections.provider` (never "platform"/"workers-ai" — those are routing, not a stored connection). */
export function getProvider(id: ByokProviderId): AIProvider {
  return providers[id];
}
