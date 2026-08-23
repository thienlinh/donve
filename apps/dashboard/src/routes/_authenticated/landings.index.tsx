import { createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/features/auth/auth-client";
import { LandingsPage } from "@/features/studio/components/landings-page";

export const Route = createFileRoute("/_authenticated/landings/")({
  // FR-A-02: a fresh signup has zero orgs — send them to create one first.
  // Only this route (the post-login front door) checks; /onboarding itself
  // doesn't, so it stays reachable regardless of org count.
  beforeLoad: async () => {
    const { data: organizations } = await authClient.organization.list();
    if (!organizations || organizations.length === 0) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: LandingsPage
});
