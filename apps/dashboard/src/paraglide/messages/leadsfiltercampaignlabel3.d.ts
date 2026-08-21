export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfiltercampaignlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Campaign" |
 *
 * @param {Leadsfiltercampaignlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfiltercampaignlabel3: ((
  inputs?: Leadsfiltercampaignlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfiltercampaignlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfiltercampaignlabel3 as "leadsFilterCampaignLabel" };
