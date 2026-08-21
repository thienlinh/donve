export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignstitle1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Campaigns" |
 *
 * @param {Campaignstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignstitle1: ((
  inputs?: Campaignstitle1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignstitle1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignstitle1 as "campaignsTitle" };
