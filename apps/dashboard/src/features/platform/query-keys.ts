/** Same shape as the other features' `query-keys.ts` — one place to invalidate from. */
export const platformKeys = {
  orgs: () => ["platform", "orgs"] as const,
  org: (orgId: string) => ["platform", "orgs", orgId] as const
};
