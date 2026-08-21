import type { CampaignListQuery } from "@dv/contracts";

export const campaignKeys = {
  list: () => ["campaigns"] as const,
  listPage: (query: CampaignListQuery) => ["campaigns", "list", query] as const,
  analytics: (id: string) => ["campaigns", id, "analytics"] as const
};
