import type { LeadListQuery } from "@dv/contracts";

/** Filter bar state — plain strings so `<input>`/`<select>` can bind directly;
 * converted to `LeadListQuery` (typed dates/booleans) only when calling the API. */
export interface LeadFilterState {
  campaignId: string;
  productId: string;
  utmSource: string;
  assigneeId: string;
  paid: "" | "true" | "false";
  dateFrom: string;
  dateTo: string;
  search: string;
}

export const emptyLeadFilters: LeadFilterState = {
  campaignId: "",
  productId: "",
  utmSource: "",
  assigneeId: "",
  paid: "",
  dateFrom: "",
  dateTo: "",
  search: ""
};

export function toLeadListQuery(
  filters: LeadFilterState,
  page: number,
  pageSize: number,
  stage?: string
): LeadListQuery {
  return {
    campaignId: filters.campaignId || undefined,
    productId: filters.productId || undefined,
    stage,
    utmSource: filters.utmSource || undefined,
    assigneeId: filters.assigneeId || undefined,
    paid: filters.paid === "" ? undefined : filters.paid === "true",
    dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
    dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
    search: filters.search || undefined,
    page,
    pageSize
  };
}
