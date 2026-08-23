export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooklastusedlabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Last used" |
 *
 * @param {Leadswebhooklastusedlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooklastusedlabel4: ((
  inputs?: Leadswebhooklastusedlabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooklastusedlabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooklastusedlabel4 as "leadsWebhookLastUsedLabel" };
