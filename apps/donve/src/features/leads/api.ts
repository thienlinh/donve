import {
  assignmentRuleSchema,
  dataSubjectRequestListSchema,
  dataSubjectRequestSchema,
  leadActivitySchema,
  leadDetailSchema,
  leadImportResultSchema,
  leadListResponseSchema,
  leadSchema,
  notifyCredentialSchema,
  operatingSummarySchema,
  orderSchema,
  salesConfigListSchema,
  savedViewSchema,
  type AssignLeadInput,
  type AssignmentRule,
  type BulkDeleteLeadsInput,
  type BulkUpdateLeadsInput,
  type CreateDataSubjectRequestInput,
  type CreateLeadActivityInput,
  type CreateSavedViewInput,
  type DataSubjectRequest,
  type DataSubjectRequestStatus,
  type Lead,
  type LeadActivity,
  type LeadDetail,
  type LeadImportRequest,
  type LeadImportResult,
  type LeadListQuery,
  type LeadListResponse,
  type NotifyCredential,
  type NotifyProvider,
  type OperatingSummary,
  type Order,
  type SalesConfigList,
  type SavedView,
  type TiktokConnection,
  tiktokConnectionSchema,
  type UpdateLeadOrderStatusInput,
  type UpdateLeadStageInput,
  type UpdateSalesConfigInput,
  type UpsertAssignmentRuleInput,
  type UpsertNotifyCredentialInput,
  type UpsertWebhookCredentialInput,
  type WebhookCredential,
  type WebhookProvider,
  webhookCredentialSchema,
  generateGenericApiKeyResultSchema
} from "@dv/contracts";
import { z } from "zod";

import { createApiFetch } from "@/lib/api-client";

const leadsFetch = createApiFetch("leads");

const pipelineResponseSchema = z.object({
  stages: z.array(
    z.object({ key: z.string(), label: z.string(), color: z.string() })
  )
});
export type PipelineStage = z.infer<
  typeof pipelineResponseSchema
>["stages"][number];

export async function fetchPipeline(): Promise<PipelineStage[]> {
  const res = await leadsFetch("/pipeline");
  return pipelineResponseSchema.parse(await res.json()).stages;
}

export async function fetchOperatingSummary(): Promise<OperatingSummary> {
  const res = await leadsFetch("/operating-summary");
  return operatingSummarySchema.parse(await res.json());
}

/** stable reference so callers can default an unloaded `pipeline` query without creating a
 * fresh array every render (react-perf/jsx-no-new-array-as-prop). */
export const EMPTY_PIPELINE: PipelineStage[] = [];

function toQueryString(query: LeadListQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") continue;
    params.set(
      key,
      value instanceof Date ? value.toISOString() : String(value)
    );
  }
  return params.toString();
}

export async function fetchLeads(
  query: LeadListQuery
): Promise<LeadListResponse> {
  const res = await leadsFetch(`?${toQueryString(query)}`);
  return leadListResponseSchema.parse(await res.json());
}

/** Full filtered export (server ignores `page`/`pageSize`, see `GET /leads/export`) — distinct
 * from the bulk toolbar's client-built CSV, which only covers the currently selected rows. */
export async function fetchLeadsExport(query: LeadListQuery): Promise<Blob> {
  const res = await leadsFetch(`/export?${toQueryString(query)}`);
  return res.blob();
}

export async function fetchLeadDetail(id: string): Promise<LeadDetail> {
  const res = await leadsFetch(`/${id}`);
  return leadDetailSchema.parse(await res.json());
}

export async function updateLeadStage(
  id: string,
  input: UpdateLeadStageInput
): Promise<Lead> {
  const res = await leadsFetch(`/${id}/stage`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return leadSchema.parse(await res.json());
}

export async function assignLead(
  id: string,
  input: AssignLeadInput
): Promise<Lead> {
  const res = await leadsFetch(`/${id}/assignee`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return leadSchema.parse(await res.json());
}

export async function createLeadActivity(
  id: string,
  input: CreateLeadActivityInput
): Promise<LeadActivity> {
  const res = await leadsFetch(`/${id}/activities`, {
    method: "POST",
    body: JSON.stringify(input)
  });
  return leadActivitySchema.parse(await res.json());
}

export async function updateLeadOrderStatus(
  id: string,
  orderId: string,
  input: UpdateLeadOrderStatusInput
): Promise<Order> {
  const res = await leadsFetch(`/${id}/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return orderSchema.parse(await res.json());
}

/** module E finding #3 — CSV import, column-mapped client-side before this call. */
export async function importLeads(
  input: LeadImportRequest
): Promise<LeadImportResult> {
  const res = await leadsFetch("/import", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return leadImportResultSchema.parse(await res.json());
}

/** NFR-10 — lead-detail-sheet's data-subject request list (delete/export requests). */
export async function fetchLeadDataSubjectRequests(
  leadId: string
): Promise<DataSubjectRequest[]> {
  const res = await leadsFetch(`/${leadId}/data-subject-requests`);
  return dataSubjectRequestListSchema.parse(await res.json())
    .dataSubjectRequests;
}

export async function createDataSubjectRequest(
  leadId: string,
  input: CreateDataSubjectRequestInput
): Promise<DataSubjectRequest> {
  const res = await leadsFetch(`/${leadId}/data-subject-requests`, {
    method: "POST",
    body: JSON.stringify(input)
  });
  return dataSubjectRequestSchema.parse(await res.json());
}

export async function completeDataSubjectRequest(
  leadId: string,
  id: string
): Promise<DataSubjectRequest> {
  const res = await leadsFetch(`/${leadId}/data-subject-requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({})
  });
  return dataSubjectRequestSchema.parse(await res.json());
}

/** Org-wide (no leadId) — feeds the top-bar overdue/due-soon indicator. */
export async function fetchOrgDataSubjectRequests(
  status?: DataSubjectRequestStatus
): Promise<DataSubjectRequest[]> {
  const query = status ? `?status=${status}` : "";
  const res = await leadsFetch(`/data-subject-requests${query}`);
  return dataSubjectRequestListSchema.parse(await res.json())
    .dataSubjectRequests;
}

/** FR-E-04 — current `seeAllLeads` per sales member, to render the toggle in MembersPage. */
export async function fetchSalesConfigList(): Promise<SalesConfigList> {
  const res = await leadsFetch("/members/sales-config");
  return salesConfigListSchema.parse(await res.json());
}

/** FR-E-04 — owner/admin toggles whether a sales member sees all org leads or only their own. */
export async function updateMemberSalesConfig(
  membershipId: string,
  input: UpdateSalesConfigInput
): Promise<void> {
  await leadsFetch(`/members/${membershipId}/sales-config`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

/** Bulk stage/assign — floating toolbar in the list view, one call for N selected rows. */
export async function bulkUpdateLeads(
  input: BulkUpdateLeadsInput
): Promise<void> {
  await leadsFetch("/bulk", { method: "PATCH", body: JSON.stringify(input) });
}

export async function bulkDeleteLeads(
  input: BulkDeleteLeadsInput
): Promise<void> {
  await leadsFetch("/bulk", { method: "DELETE", body: JSON.stringify(input) });
}

/** Fire-and-forget from `LeadDetailSheet` on open — clears the unread indicator. */
export async function markLeadViewed(id: string): Promise<void> {
  await leadsFetch(`/${id}/viewed`, { method: "PATCH" });
}

const assignmentRuleListSchema = z.array(assignmentRuleSchema);

export async function fetchAssignmentRules(): Promise<AssignmentRule[]> {
  const res = await leadsFetch("/assignment-rules");
  return assignmentRuleListSchema.parse(await res.json());
}

export async function createAssignmentRule(
  input: UpsertAssignmentRuleInput
): Promise<AssignmentRule> {
  const res = await leadsFetch("/assignment-rules", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return assignmentRuleSchema.parse(await res.json());
}

export async function updateAssignmentRule(
  id: string,
  input: Partial<UpsertAssignmentRuleInput>
): Promise<AssignmentRule> {
  const res = await leadsFetch(`/assignment-rules/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return assignmentRuleSchema.parse(await res.json());
}

export async function deleteAssignmentRule(id: string): Promise<void> {
  await leadsFetch(`/assignment-rules/${id}`, { method: "DELETE" });
}

const webhookCredentialListSchema = z.array(webhookCredentialSchema);

export async function fetchWebhookCredentials(): Promise<WebhookCredential[]> {
  const res = await leadsFetch("/webhook-credentials");
  return webhookCredentialListSchema.parse(await res.json());
}

export async function upsertWebhookCredential(
  provider: WebhookProvider,
  input: UpsertWebhookCredentialInput
): Promise<void> {
  await leadsFetch(`/webhook-credentials/${provider}`, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}

export async function deleteWebhookCredential(
  provider: WebhookProvider
): Promise<void> {
  await leadsFetch(`/webhook-credentials/${provider}`, { method: "DELETE" });
}

export async function generateApiKey(
  provider: "generic" | "google_ads"
): Promise<string> {
  const res = await leadsFetch(`/webhook-credentials/${provider}/generate`, {
    method: "POST"
  });
  return generateGenericApiKeyResultSchema.parse(await res.json()).apiKey;
}

const tiktokConnectionListSchema = z.array(tiktokConnectionSchema);

export async function fetchTiktokConnections(): Promise<TiktokConnection[]> {
  const res = await leadsFetch("/tiktok-connections");
  return tiktokConnectionListSchema.parse(await res.json());
}

export async function disconnectTiktokConnection(
  campaignId: string
): Promise<void> {
  await leadsFetch(`/tiktok-connections/${campaignId}`, { method: "DELETE" });
}

const notifyCredentialListSchema = z.array(notifyCredentialSchema);

export async function fetchNotifyCredentials(): Promise<NotifyCredential[]> {
  const res = await leadsFetch("/notify-credentials");
  return notifyCredentialListSchema.parse(await res.json());
}

export async function upsertNotifyCredential(
  provider: NotifyProvider,
  input: UpsertNotifyCredentialInput
): Promise<void> {
  await leadsFetch(`/notify-credentials/${provider}`, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}

export async function deleteNotifyCredential(
  provider: NotifyProvider
): Promise<void> {
  await leadsFetch(`/notify-credentials/${provider}`, { method: "DELETE" });
}

const savedViewListSchema = z.array(savedViewSchema);

export async function fetchSavedViews(): Promise<SavedView[]> {
  const res = await leadsFetch("/saved-views");
  return savedViewListSchema.parse(await res.json());
}

export async function createSavedView(
  input: CreateSavedViewInput
): Promise<SavedView> {
  const res = await leadsFetch("/saved-views", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return savedViewSchema.parse(await res.json());
}

export async function deleteSavedView(id: string): Promise<void> {
  await leadsFetch(`/saved-views/${id}`, { method: "DELETE" });
}
