import { createFileRoute } from "@tanstack/react-router";

import { ArchitecturePage } from "@/features/strategy/components/architecture-page";

export const Route = createFileRoute(
  "/_authenticated/landings/$id/architecture"
)({
  component: ArchitecturePage
});
