export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookgoogleadstitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Google Ads (Lead Form)" |
 *
 * @param {Leadswebhookgoogleadstitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookgoogleadstitle4: ((
  inputs?: Leadswebhookgoogleadstitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookgoogleadstitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookgoogleadstitle4 as "leadsWebhookGoogleAdsTitle" };
