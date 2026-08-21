export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellcampaignsnav2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Campaigns" |
 *
 * @param {Shellcampaignsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellcampaignsnav2: ((
  inputs?: Shellcampaignsnav2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellcampaignsnav2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellcampaignsnav2 as "shellCampaignsNav" };
