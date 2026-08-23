export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookcampaignlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Campaign" |
 *
 * @param {Leadswebhookcampaignlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookcampaignlabel3: ((
  inputs?: Leadswebhookcampaignlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookcampaignlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookcampaignlabel3 as "leadsWebhookCampaignLabel" };
