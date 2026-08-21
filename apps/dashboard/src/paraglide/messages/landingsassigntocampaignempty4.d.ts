export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsassigntocampaignempty4Inputs = {};
/**
 * | output |
 * | --- |
 * | "No campaigns yet — create one first." |
 *
 * @param {Landingsassigntocampaignempty4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsassigntocampaignempty4: ((
  inputs?: Landingsassigntocampaignempty4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsassigntocampaignempty4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsassigntocampaignempty4 as "landingsAssignToCampaignEmpty" };
