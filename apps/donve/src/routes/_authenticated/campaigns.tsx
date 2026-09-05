import { createFileRoute } from "@tanstack/react-router";

import { CampaignsPage } from "@/features/campaigns/components/campaigns-page";

export const Route = createFileRoute("/_authenticated/campaigns")({
  component: CampaignsPage
});
