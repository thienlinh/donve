export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookmissingbadge3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Not set" |
 *
 * @param {Leadswebhookmissingbadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookmissingbadge3: ((
  inputs?: Leadswebhookmissingbadge3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookmissingbadge3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookmissingbadge3 as "leadsWebhookMissingBadge" };
