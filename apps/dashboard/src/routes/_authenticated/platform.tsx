import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { fetchWhoAmI, PlatformForbiddenError } from "@/features/platform/api";
import { PlatformOrgsPage } from "@/features/platform/components/platform-orgs-page";

/** `?org=<id>` picks the org-detail view instead of the list — a URL, not local state, so an ops
 * conversation can link straight to the org being discussed. */
const platformSearchSchema = z.object({ org: z.string().optional() });

/**
 * Hidden route, no nav entry (docs/architecture/platform-admin.md §5) — `_authenticated`
 * already guarantees a session by the time this runs; this only adds the platform-staff
 * check on top, via `/platform/whoami`. Non-staff (or logged-out-by-the-time-this-runs)
 * gets bounced to `/landings` same as any other unauthorized area, no dedicated error page.
 */
export const Route = createFileRoute("/_authenticated/platform")({
  validateSearch: platformSearchSchema,
  beforeLoad: async () => {
    try {
      return { staff: await fetchWhoAmI() };
    } catch (err) {
      if (err instanceof PlatformForbiddenError) {
        throw redirect({ to: "/landings" });
      }
      throw err;
    }
  },
  component: PlatformOrgsPage
});
