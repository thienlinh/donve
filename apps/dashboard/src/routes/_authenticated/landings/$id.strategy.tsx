import { createFileRoute } from "@tanstack/react-router";

import { StrategyPage } from "@/features/strategy/components/strategy-page";

export const Route = createFileRoute("/_authenticated/landings/$id/strategy")({
  component: StrategyPage
});
