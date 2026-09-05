import { createFileRoute, redirect } from "@tanstack/react-router";

import { authQueryKeys, fetchOrganizations } from "@/features/auth/queries";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_authenticated/landings/")({
  // FR-A-02: a fresh signup has zero orgs — send them to create one first.
  // Keep the old URL as a compatibility redirect; nested editor routes still use
  // /landings/$id/... internally.
  beforeLoad: async () => {
    const organizations = await queryClient.ensureQueryData({
      queryKey: authQueryKeys.organizations,
      queryFn: fetchOrganizations
    });
    if (organizations.length === 0) {
      throw redirect({ to: "/onboarding" });
    }
    throw redirect({ to: "/offers" });
  }
});
