import type { DataSubjectRequestStatus, LeadListQuery } from "@dv/contracts";

/** `page`/`pageSize` are optional here so a `useInfiniteQuery` caller (the kanban board, which
 * lets react-query manage pagination itself) can key on the filter portion alone. */
type LeadListKeyQuery = Omit<LeadListQuery, "page" | "pageSize"> &
  Partial<Pick<LeadListQuery, "page" | "pageSize">>;

export const leadKeys = {
  pipeline: () => ["leads", "pipeline"] as const,
  operatingSummary: () => ["leads", "operatingSummary"] as const,
  list: (query: LeadListKeyQuery) => ["leads", "list", query] as const,
  detail: (id: string) => ["leads", "detail", id] as const,
  salesConfig: () => ["leads", "salesConfig"] as const,
  dataSubjectRequests: (leadId: string) =>
    ["leads", "dataSubjectRequests", leadId] as const,
  orgDataSubjectRequests: (status?: DataSubjectRequestStatus) =>
    ["leads", "dataSubjectRequests", "org", status ?? "all"] as const,
  assignmentRules: () => ["leads", "assignmentRules"] as const,
  savedViews: () => ["leads", "savedViews"] as const,
  webhookCredentials: () => ["leads", "webhookCredentials"] as const,
  notifyCredentials: () => ["leads", "notifyCredentials"] as const,
  tiktokConnections: () => ["leads", "tiktokConnections"] as const
};
