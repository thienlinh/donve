import { createFileRoute, redirect } from "@tanstack/react-router";

import { authQueryKeys, fetchOrganizations } from "@/features/auth/queries";
import { OfferWorkspacePage } from "@/features/studio/components/offer-workspace-page";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_authenticated/offers/$id")({
  beforeLoad: async () => {
    const organizations = await queryClient.ensureQueryData({
      queryKey: authQueryKeys.organizations,
      queryFn: fetchOrganizations
    });
    if (organizations.length === 0) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: OfferWorkspacePage
});
