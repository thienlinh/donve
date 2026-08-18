import { createFileRoute } from "@tanstack/react-router";

import { AiConnectionsPage } from "@/features/ai-connections/components/ai-connections-page";

export const Route = createFileRoute("/_authenticated/ai-connections")({
  component: AiConnectionsPage
});
