import { createFileRoute } from "@tanstack/react-router";

import { StudioNativePage } from "@/features/studio-native/components/studio-native-page";

export const Route = createFileRoute(
  "/_authenticated/landings/$id/studio-native"
)({
  component: StudioNativePage
});
