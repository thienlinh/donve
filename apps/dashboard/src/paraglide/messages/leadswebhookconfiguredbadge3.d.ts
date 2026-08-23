export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookconfiguredbadge3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Configured" |
 *
 * @param {Leadswebhookconfiguredbadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookconfiguredbadge3: ((
  inputs?: Leadswebhookconfiguredbadge3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookconfiguredbadge3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookconfiguredbadge3 as "leadsWebhookConfiguredBadge" };
