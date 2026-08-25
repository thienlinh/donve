import type { Db } from "./client/types.js";
import {
  orgFeatureOverridesRepository,
  planFeaturesRepository
} from "./repositories/feature-flags.js";
import { organizationsRepository } from "./repositories/organizations.js";

/**
 * The single runtime feature check (docs/architecture/platform-admin.md §12) — used by
 * `requireFeature(key)` in apps/api and by any UI that needs to lock a control.
 * A per-org override always wins over the org's plan: that's the whole point of it
 * (enable early for one customer / disable for abuse).
 */
export async function hasFeature(
  db: Db,
  orgId: string,
  key: string
): Promise<boolean> {
  const override = await orgFeatureOverridesRepository.find(db, orgId, key);
  if (override) return override.enabled === "true";

  const org = await organizationsRepository.findById(db, orgId);
  if (!org) return false;
  return planFeaturesRepository.has(db, org.plan, key);
}
