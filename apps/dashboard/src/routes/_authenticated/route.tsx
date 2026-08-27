import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell/app-shell";
import { authClient } from "@/features/auth/auth-client";
import { takePendingInviteId } from "@/features/auth/pending-invite";
import {
  authQueryKeys,
  fetchOrganizations,
  fetchSession
} from "@/features/auth/queries";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    // `ensureQueryData` (not a raw `authClient.getSession()`/`.organization.list()` call) so
    // this warms the same cache `useSessionQuery`/`useOrganizationsQuery` read from — otherwise
    // the shell's hooks re-fetch the exact same data a moment later on first render.
    const data = await queryClient.ensureQueryData({
      queryKey: authQueryKeys.session,
      queryFn: fetchSession
    });
    if (!data?.session) {
      throw redirect({ to: "/login" });
    }
    // The single chokepoint every post-auth navigation passes through (existing-user login,
    // new-user signup -> verify-email -> auto sign-in) — /accept-invite stashes an invitation
    // id here when it hits an unauthenticated visitor, so it's resumed the moment a session
    // exists instead of dropping the invitee onto the default landing page.
    const pendingInviteId = takePendingInviteId();
    if (pendingInviteId) {
      throw redirect({
        to: "/accept-invite",
        search: { invitationId: pendingInviteId }
      });
    }
    // A session's activeOrganizationId isn't set automatically on login (only
    // /onboarding's explicit setActive does that) — every org-scoped API call
    // 403s with "no_active_organization" until one is picked. Auto-activate the
    // user's first org so returning users aren't dumped into a broken app.
    if (!data.session.activeOrganizationId) {
      const organizations = await queryClient.ensureQueryData({
        queryKey: authQueryKeys.organizations,
        queryFn: fetchOrganizations
      });
      const [firstOrg] = organizations;
      if (firstOrg) {
        await authClient.organization.setActive({
          organizationId: firstOrg.id
        });
        // setActive changes session.activeOrganizationId and the active-org row — the session
        // fetched above is now stale, so drop the whole cache rather than serve it pre-activation.
        await queryClient.invalidateQueries();
      }
    }
  },
  component: AuthenticatedLayout
});

function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
