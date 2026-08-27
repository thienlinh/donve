import * as m from "@/paraglide/messages.js";

/**
 * User-facing copy for `FeatureRequiredError.featureKey` (`apps/api/src/middleware/require-feature.ts`).
 * Keyed by the same string the API's `requireFeature(key)` gate uses — add a new entry here
 * whenever a new key is gated, no other wiring needed.
 */
const FEATURE_UPGRADE_COPY: Record<
  string,
  { title: () => string; description: () => string }
> = {
  custom_domain: {
    title: m.domainsUpgradeRequiredTitle,
    description: m.domainsUpgradeRequiredDescription
  }
};

export function featureUpgradeCopy(featureKey: string): {
  title: string;
  description: string;
} {
  const copy = FEATURE_UPGRADE_COPY[featureKey];
  return {
    title: copy ? copy.title() : m.featureUpgradeGenericTitle(),
    description: copy
      ? copy.description()
      : m.featureUpgradeGenericDescription()
  };
}
