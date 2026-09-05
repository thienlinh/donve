import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { z } from "zod";

import { authQueryKeys, fetchOrganizations } from "@/features/auth/queries";
import {
  LandingsPage,
  type LandingListFilters
} from "@/features/studio/components/landings-page";
import { queryClient } from "@/lib/query-client";

const offersSearchSchema = z.object({
  status: z.enum(["published", "draft"]).optional(),
  campaignId: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["name", "updated"]).optional()
});

export const Route = createFileRoute("/_authenticated/offers/")({
  validateSearch: offersSearchSchema,
  beforeLoad: async () => {
    const organizations = await queryClient.ensureQueryData({
      queryKey: authQueryKeys.organizations,
      queryFn: fetchOrganizations
    });
    if (organizations.length === 0) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: OffersPage
});

function OffersPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const handleFiltersChange = useCallback(
    (filters: LandingListFilters) => {
      const nextSearch = {
        campaignId:
          filters.campaignId === "all" ? undefined : filters.campaignId,
        search: filters.search || undefined,
        sort: filters.sort === "updated" ? undefined : filters.sort,
        status: filters.status === "all" ? undefined : filters.status
      };

      if (
        nextSearch.campaignId === search.campaignId &&
        nextSearch.search === search.search &&
        nextSearch.sort === search.sort &&
        nextSearch.status === search.status
      ) {
        return;
      }

      void navigate({
        replace: true,
        search: nextSearch,
        to: "/offers"
      });
    },
    [navigate, search]
  );

  return (
    <LandingsPage
      initialFilters={search}
      onFiltersChange={handleFiltersChange}
      surface="offers"
    />
  );
}
