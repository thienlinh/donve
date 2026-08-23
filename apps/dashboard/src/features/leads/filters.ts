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

/** Mirrors `leadsSearchSchema` in `routes/_authenticated/leads.tsx` — kept as a separate type
 * (not reused directly) since route search params are all-optional while `LeadFilterState`
 * defaults every field to `""` for controlled inputs. */
export interface LeadSearchParams {
  search?: string;
  campaignId?: string;
  productId?: string;
  utmSource?: string;
  assigneeId?: string;
  paid?: "true" | "false";
  dateFrom?: string;
  dateTo?: string;
}

export function searchToFilters(search: LeadSearchParams): LeadFilterState {
  return {
    search: search.search ?? "",
    campaignId: search.campaignId ?? "",
    productId: search.productId ?? "",
    utmSource: search.utmSource ?? "",
    assigneeId: search.assigneeId ?? "",
    paid: search.paid ?? "",
    dateFrom: search.dateFrom ?? "",
    dateTo: search.dateTo ?? ""
  };
}

export function filtersToSearch(filters: LeadFilterState): LeadSearchParams {
  return {
    search: filters.search || undefined,
    campaignId: filters.campaignId || undefined,
    productId: filters.productId || undefined,
    utmSource: filters.utmSource || undefined,
    assigneeId: filters.assigneeId || undefined,
    paid: filters.paid || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined
  };
}

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
