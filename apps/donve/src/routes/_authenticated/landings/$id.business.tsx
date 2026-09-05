import { createFileRoute } from "@tanstack/react-router";

import { BusinessPage } from "@/features/strategy/components/business-page";

export const Route = createFileRoute("/_authenticated/landings/$id/business")({
  component: BusinessPage
});
