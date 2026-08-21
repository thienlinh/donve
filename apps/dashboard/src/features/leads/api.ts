import {
  dataSubjectRequestListSchema,
  dataSubjectRequestSchema,
  leadActivitySchema,
  leadDetailSchema,
  leadImportResultSchema,
  leadListResponseSchema,
  leadSchema,
  orderSchema,
  salesConfigListSchema,
  type AssignLeadInput,
  type CreateDataSubjectRequestInput,
  type CreateLeadActivityInput,
  type DataSubjectRequest,
  type DataSubjectRequestStatus,
  type Lead,
  type LeadActivity,
  type LeadDetail,
  type LeadImportRequest,
  type LeadImportResult,
  type LeadListQuery,
  type LeadListResponse,
  type Order,
  type SalesConfigList,
  type UpdateLeadOrderStatusInput,
  type UpdateLeadStageInput,
  type UpdateSalesConfigInput
} from "@dv/contracts";
import { z } from "zod";

/** Same fetch pattern as `features/campaigns/api.ts` — cookie session lives on the API origin. */
async function leadsFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads${path}`, {
    ...init,
    credentials: "include",
    headers
  });
  if (!res.ok) throw new Error(`leads api ${path} failed: ${res.status}`);
  return res;
}

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
