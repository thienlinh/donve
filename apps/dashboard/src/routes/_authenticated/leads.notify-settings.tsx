import { createFileRoute } from "@tanstack/react-router";

import { NotifySettingsPage } from "@/features/leads/components/notify-settings-page";

export const Route = createFileRoute("/_authenticated/leads/notify-settings")({
  component: NotifySettingsPage
});
