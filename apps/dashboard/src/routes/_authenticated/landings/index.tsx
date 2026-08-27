import { createFileRoute, redirect } from "@tanstack/react-router";

import { authQueryKeys, fetchOrganizations } from "@/features/auth/queries";
import { LandingsPage } from "@/features/studio/components/landings-page";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_authenticated/landings/")({
  // FR-A-02: a fresh signup has zero orgs — send them to create one first.
  // Only this route (the post-login front door) checks; /onboarding itself
  // doesn't, so it stays reachable regardless of org count.
  beforeLoad: async () => {
    // Same cache `useOrganizationsQuery` reads (org-switcher etc.) — `ensureQueryData` reuses
    // whatever `_authenticated`'s own beforeLoad just fetched instead of fetching again.
    const organizations = await queryClient.ensureQueryData({
      queryKey: authQueryKeys.organizations,
      queryFn: fetchOrganizations
    });
    if (organizations.length === 0) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: LandingsPage
});
