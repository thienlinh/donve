import { createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authenticated/landings")({
  // FR-A-02: a fresh signup has zero orgs — send them to create one first.
  // Only this route (the post-login front door) checks; /onboarding itself
  // doesn't, so it stays reachable regardless of org count.
  beforeLoad: async () => {
    const { data: organizations } = await authClient.organization.list();
    if (!organizations || organizations.length === 0) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: LandingsPage
});

/**
 * Thin placeholder — the real `/landings` grid (FR-B-00) is Phase 1's front
 * door and gets built there, not here (this prompt only covers the shell).
 */
function LandingsPage() {
  return (
    <div className="text-sm text-muted-foreground">{m.shellLandingsNav()}</div>
  );
}
