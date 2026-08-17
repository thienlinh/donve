import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * `/api/auth/*` on `apps/api` (apps/api/src/app.ts) — the organization plugin
 * client rides the same mount for free (list/create/setActive orgs, no
 * separate API route needed on our side).
 */
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [organizationClient()]
});

export const { useSession, useListOrganizations, useActiveOrganization } =
  authClient;
