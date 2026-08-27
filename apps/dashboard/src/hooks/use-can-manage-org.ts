import {
  useActiveOrganizationQuery,
  useSessionQuery
} from "@/features/auth/queries";

/**
 * Owner/admin gate for org-settings-shaped pages (webhook/assignment-rules/notify/org
 * settings) — same membership lookup duplicated verbatim across each before this hook.
 */
export function useCanManageOrg(): boolean {
  const { data: session } = useSessionQuery();
  const { data: activeOrganization } = useActiveOrganizationQuery();
  const myMembership = activeOrganization?.members.find(
    (member) => member.userId === session?.user.id
  );
  return myMembership?.role === "owner" || myMembership?.role === "admin";
}
