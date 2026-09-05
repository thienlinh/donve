import {
  campaignAnalyticsSchema,
  campaignListResponseSchema,
  campaignWithProductsSchema,
  sourceLinkListResponseSchema,
  sourceLinkSchema,
  type BulkDeleteCampaignsInput,
  type BulkUpdateCampaignsInput,
  type CampaignAnalytics,
  type CampaignListQuery,
  type CampaignListResponse,
  type CampaignWithProducts,
  type CreateCampaignInput,
  type CreateSourceLinkInput,
  type SourceLink,
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
  if (query.search) params.set("search", query.search);
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

export async function duplicateCampaign(
  id: string
): Promise<CampaignWithProducts> {
  const res = await campaignsFetch(`/${id}/duplicate`, { method: "POST" });
  return campaignWithProductsSchema.parse(await res.json());
}

/** Bulk status-change/delete — floating toolbar in the campaigns table, one call for N
 * selected rows (same shape as `bulkUpdateLeads`/`bulkDeleteLeads`). */
export async function bulkUpdateCampaigns(
  input: BulkUpdateCampaignsInput
): Promise<void> {
  await campaignsFetch("/bulk", {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function bulkDeleteCampaigns(
  input: BulkDeleteCampaignsInput
): Promise<void> {
  await campaignsFetch("/bulk", {
    method: "DELETE",
    body: JSON.stringify(input)
  });
}

export async function fetchCampaignAnalytics(
  id: string
): Promise<CampaignAnalytics> {
  const res = await campaignsFetch(`/${id}/analytics`);
  return campaignAnalyticsSchema.parse(await res.json());
}

export async function fetchSourceLinks(
  campaignId: string
): Promise<SourceLink[]> {
  const res = await campaignsFetch(`/${campaignId}/source-links`);
  return sourceLinkListResponseSchema.parse(await res.json()).links;
}

export async function createSourceLink(
  campaignId: string,
  input: CreateSourceLinkInput
): Promise<SourceLink> {
  const res = await campaignsFetch(`/${campaignId}/source-links`, {
    method: "POST",
    body: JSON.stringify(input)
  });
  return sourceLinkSchema.parse(await res.json());
}

export async function removeSourceLink(
  campaignId: string,
  linkId: string
): Promise<void> {
  await campaignsFetch(`/${campaignId}/source-links/${linkId}`, {
    method: "DELETE"
  });
}
