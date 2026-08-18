export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsfilterallcampaigns3Inputs = {};
/**
 * | output |
 * | --- |
 * | "All campaigns" |
 *
 * @param {Landingsfilterallcampaigns3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsfilterallcampaigns3: ((
  inputs?: Landingsfilterallcampaigns3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsfilterallcampaigns3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsfilterallcampaigns3 as "landingsFilterAllCampaigns" };
