import {
  organizationSchema,
  platformOrgDetailSchema,
  platformOrgListItemSchema,
  platformStaffMemberSchema,
  platformWhoAmISchema,
  refundRequestSchema,
  type Organization,
  type PlatformOrgDetail,
  type PlatformOrgListItem,
  type PlatformRefundAssistInput,
  type PlatformStaffMember,
  type PlatformStaffUpsertInput,
  type PlatformSubscriptionUpdateInput,
  type PlatformWhoAmI,
  type RefundRequest
} from "@dv/contracts";
import { z } from "zod";

/** Thrown when the current session has no `platform_staff` row (403) — the route's
 * `beforeLoad` catches this specifically to redirect non-staff away from `/platform`. */
export class PlatformForbiddenError extends Error {}

const orgListResponseSchema = z.object({
  orgs: z.array(platformOrgListItemSchema)
});

const staffListResponseSchema = z.object({
  staff: z.array(platformStaffMemberSchema)
});

/**
 * Plain `fetch` against `apps/api`'s `/platform/*` group (docs/architecture/platform-admin.md) —
 * `credentials: "include"` is required since the session lives in a cookie set by better-auth
 * on the API origin, which differs from the app origin in dev (Vite) and prod (CF Pages).
 * Not `lib/api-client.ts`'s `createApiFetch`: that one hardcodes the `/api/` prefix, and this
 * group deliberately sits outside it.
 */
async function platformFetch(
  path: string,
  init?: { method: string; body: unknown }
): Promise<unknown> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/platform${path}`, {
    credentials: "include",
    method: init?.method,
    headers: init ? { "content-type": "application/json" } : undefined,
    body: init ? JSON.stringify(init.body) : undefined
  });
  if (res.status === 401 || res.status === 403) {
    throw new PlatformForbiddenError(`not platform staff (${res.status})`);
  }
  if (!res.ok) {
    throw new Error(`platform api ${path} failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchWhoAmI(): Promise<PlatformWhoAmI> {
  return platformWhoAmISchema.parse(await platformFetch("/whoami"));
}

export async function fetchOrgs(): Promise<PlatformOrgListItem[]> {
  return orgListResponseSchema.parse(await platformFetch("/orgs")).orgs;
}

export async function fetchOrgDetail(
  orgId: string
): Promise<PlatformOrgDetail> {
  return platformOrgDetailSchema.parse(await platformFetch(`/orgs/${orgId}`));
}

export async function setOrgDisabled(
  orgId: string,
  disabled: boolean,
  reason: string
): Promise<Organization> {
  return organizationSchema.parse(
    await platformFetch(`/orgs/${orgId}/${disabled ? "disable" : "enable"}`, {
      method: "POST",
      body: { reason }
    })
  );
}

export async function refundAssist(
  orgId: string,
  input: PlatformRefundAssistInput
): Promise<RefundRequest> {
  return refundRequestSchema.parse(
    await platformFetch(`/orgs/${orgId}/refund-assist`, {
      method: "POST",
      body: input
    })
  );
}

export async function updateOrgSubscription(
  orgId: string,
  input: PlatformSubscriptionUpdateInput
): Promise<void> {
  await platformFetch(`/orgs/${orgId}/subscription`, {
    method: "PATCH",
    body: input
  });
}

export async function fetchStaff(): Promise<PlatformStaffMember[]> {
  return staffListResponseSchema.parse(await platformFetch("/staff")).staff;
}

export async function upsertStaff(
  input: PlatformStaffUpsertInput
): Promise<PlatformStaffMember> {
  return platformStaffMemberSchema.parse(
    await platformFetch("/staff", { method: "POST", body: input })
  );
}

export async function removeStaff(userId: string): Promise<void> {
  await platformFetch(`/staff/${userId}`, {
    method: "DELETE",
    body: undefined
  });
}
