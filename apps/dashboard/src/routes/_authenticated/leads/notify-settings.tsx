import { createFileRoute } from "@tanstack/react-router";

import { NotifySettingsPage } from "@/features/leads/components/settings/notify-settings-page";

export const Route = createFileRoute("/_authenticated/leads/notify-settings")({
  component: NotifySettingsPage
});
