export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooknocampaignwarning4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Select a campaign above to get a working webhook URL — every lead needs to know which campaign it belongs to." |
 *
 * @param {Leadswebhooknocampaignwarning4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooknocampaignwarning4: ((
  inputs?: Leadswebhooknocampaignwarning4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooknocampaignwarning4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooknocampaignwarning4 as "leadsWebhookNoCampaignWarning" };
