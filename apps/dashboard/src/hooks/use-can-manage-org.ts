import { useActiveOrganization, useSession } from "@/features/auth/auth-client";

/**
 * Owner/admin gate for org-settings-shaped pages (webhook/assignment-rules/notify/org
 * settings) — same membership lookup duplicated verbatim across each before this hook.
 */
export function useCanManageOrg(): boolean {
  const { data: session } = useSession();
  const { data: activeOrganization } = useActiveOrganization();
  const myMembership = activeOrganization?.members.find(
    (member) => member.userId === session?.user.id
  );
  return myMembership?.role === "owner" || myMembership?.role === "admin";
}
