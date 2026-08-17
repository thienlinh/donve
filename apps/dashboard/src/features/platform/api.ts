import {
  organizationSchema,
  platformWhoAmISchema,
  type Organization,
  type PlatformWhoAmI
} from "@dv/contracts";
import { z } from "zod";

/** Thrown when the current session has no `platform_staff` row (403) — the route's
 * `beforeLoad` catches this specifically to redirect non-staff away from `/platform`. */
export class PlatformForbiddenError extends Error {}

const orgListResponseSchema = z.object({ orgs: z.array(organizationSchema) });

/**
 * Plain `fetch` against `apps/api`'s `/platform/*` group (docs/architecture/platform-admin.md) —
 * `credentials: "include"` is required since the session lives in a cookie set by better-auth
 * on the API origin, which differs from the dashboard origin in dev (Vite) and prod (CF Pages).
 */
async function platformFetch(path: string): Promise<unknown> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/platform${path}`, {
    credentials: "include"
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

export async function fetchOrgs(): Promise<Organization[]> {
  return orgListResponseSchema.parse(await platformFetch("/orgs")).orgs;
}
