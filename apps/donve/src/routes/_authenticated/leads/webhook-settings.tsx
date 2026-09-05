import { createFileRoute } from "@tanstack/react-router";

import { WebhookSettingsPage } from "@/features/leads/components/settings/webhook-settings-page";

export const Route = createFileRoute("/_authenticated/leads/webhook-settings")({
  component: WebhookSettingsPage
});
