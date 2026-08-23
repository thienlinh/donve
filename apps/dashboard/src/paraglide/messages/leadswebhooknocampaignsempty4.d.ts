export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooknocampaignsempty4Inputs = {};
/**
 * | output |
 * | --- |
 * | "No campaigns yet — create one first, then come back here for its webhook URL." |
 *
 * @param {Leadswebhooknocampaignsempty4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooknocampaignsempty4: ((
  inputs?: Leadswebhooknocampaignsempty4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooknocampaignsempty4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooknocampaignsempty4 as "leadsWebhookNoCampaignsEmpty" };
