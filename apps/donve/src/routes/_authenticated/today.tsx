import { createFileRoute, redirect } from "@tanstack/react-router";

import { authQueryKeys, fetchOrganizations } from "@/features/auth/queries";
import { TodayPage } from "@/features/today/components/today-page";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_authenticated/today")({
  beforeLoad: async () => {
    const organizations = await queryClient.ensureQueryData({
      queryKey: authQueryKeys.organizations,
      queryFn: fetchOrganizations
    });
    if (organizations.length === 0) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: TodayPage
});
