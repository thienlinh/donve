import {
  campaignAnalyticsSchema,
  campaignListResponseSchema,
  campaignWithProductsSchema,
  type CampaignAnalytics,
  type CampaignListQuery,
  type CampaignListResponse,
  type CampaignWithProducts,
  type CreateCampaignInput,
  type UpdateCampaignInput
} from "@dv/contracts";

import { createApiFetch } from "@/lib/api-client";

const campaignsFetch = createApiFetch("campaigns");

export async function fetchCampaignsPage(
  query: CampaignListQuery
): Promise<CampaignListResponse> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  const res = await campaignsFetch(`?${params.toString()}`);
  return campaignListResponseSchema.parse(await res.json());
}

/** ponytail: convenience wrapper for "pick a campaign" dropdowns (assign-to-campaign menu, leads
 * filter bar) that want the full org list, not a page — capped at the API's max pageSize (100).
 * Add real "load more" here if an org ever has more campaigns than that. */
export async function fetchCampaigns(): Promise<CampaignWithProducts[]> {
  const { campaigns } = await fetchCampaignsPage({ page: 1, pageSize: 100 });
  return campaigns;
}

export async function createCampaign(
  input: CreateCampaignInput
): Promise<CampaignWithProducts> {
  const res = await campaignsFetch("", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return campaignWithProductsSchema.parse(await res.json());
}

export async function updateCampaign(
  id: string,
  input: UpdateCampaignInput
): Promise<CampaignWithProducts> {
  const res = await campaignsFetch(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return campaignWithProductsSchema.parse(await res.json());
}

export async function removeCampaign(id: string): Promise<void> {
  await campaignsFetch(`/${id}`, { method: "DELETE" });
}

export async function fetchCampaignAnalytics(
  id: string
): Promise<CampaignAnalytics> {
  const res = await campaignsFetch(`/${id}/analytics`);
  return campaignAnalyticsSchema.parse(await res.json());
}
