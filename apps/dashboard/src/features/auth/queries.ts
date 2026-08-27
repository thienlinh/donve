import { useQuery } from "@tanstack/react-query";

import { queryClient } from "@/lib/query-client";

import { authClient } from "./auth-client";

/**
 * TanStack Query wrappers around better-auth's session/organization reads.
 *
 * better-auth's own `useSession`/`useListOrganizations`/`useActiveOrganization` hooks issue a
 * fresh network fetch on every mount, unconditionally — its generic `useAuthQuery` (the nanostore
 * atom backing those hooks) has no staleness check at all, so every one of these hooks mounting
 * anywhere in the app re-fetches even if a route's `beforeLoad` guard just fetched the exact same
 * data a moment earlier. Routing the same reads through the query client instead lets `beforeLoad`
 * warm the cache with `ensureQueryData` and every mounted component share that one fetch.
 */
export const authQueryKeys = {
  session: ["auth", "session"] as const,
  organizations: ["auth", "organizations"] as const,
  activeOrganization: ["auth", "active-organization"] as const
};

// Session/org membership churn slowly relative to a single page view — long enough a window
// absorbs the beforeLoad-guard-plus-first-render double fetch, short enough to self-heal without
// explicit invalidation everywhere. Mutations that actually change this data (switch org, create
// org, accept invitation, sign out) invalidate/clear the cache explicitly rather than waiting
// this out — see org-switcher.tsx, onboarding-page.tsx, pending-invitations-banner.tsx, top-bar.tsx.
const AUTH_STALE_TIME_MS = 30_000;
for (const key of Object.values(authQueryKeys)) {
  queryClient.setQueryDefaults(key, { staleTime: AUTH_STALE_TIME_MS });
}

export async function fetchSession() {
  const { data } = await authClient.getSession();
  return data;
}

export async function fetchOrganizations() {
  const { data } = await authClient.organization.list();
  return data ?? [];
}

export async function fetchActiveOrganization() {
  const { data } = await authClient.organization.getFullOrganization();
  return data ?? null;
}

export function useSessionQuery() {
  return useQuery({ queryKey: authQueryKeys.session, queryFn: fetchSession });
}

export function useOrganizationsQuery() {
  return useQuery({
    queryKey: authQueryKeys.organizations,
    queryFn: fetchOrganizations
  });
}

export function useActiveOrganizationQuery() {
  return useQuery({
    queryKey: authQueryKeys.activeOrganization,
    queryFn: fetchActiveOrganization
  });
}
