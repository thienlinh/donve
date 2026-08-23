export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookcampaignplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Select a campaign" |
 *
 * @param {Leadswebhookcampaignplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookcampaignplaceholder3: ((
  inputs?: Leadswebhookcampaignplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookcampaignplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookcampaignplaceholder3 as "leadsWebhookCampaignPlaceholder" };
