import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell/app-shell";
import { authClient } from "@/features/auth/auth-client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      throw redirect({ to: "/login" });
    }
    // A session's activeOrganizationId isn't set automatically on login (only
    // /onboarding's explicit setActive does that) — every org-scoped API call
    // 403s with "no_active_organization" until one is picked. Auto-activate the
    // user's first org so returning users aren't dumped into a broken app.
    if (!data.session.activeOrganizationId) {
      const { data: organizations } = await authClient.organization.list();
      const [firstOrg] = organizations ?? [];
      if (firstOrg) {
        await authClient.organization.setActive({
          organizationId: firstOrg.id
        });
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
