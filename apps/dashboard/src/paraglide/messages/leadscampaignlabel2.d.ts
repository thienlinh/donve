export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadscampaignlabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Campaign" |
 *
 * @param {Leadscampaignlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadscampaignlabel2: ((
  inputs?: Leadscampaignlabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadscampaignlabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadscampaignlabel2 as "leadsCampaignLabel" };
