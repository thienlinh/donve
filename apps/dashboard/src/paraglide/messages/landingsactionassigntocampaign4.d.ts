export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsactionassigntocampaign4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Assign to campaign" |
 *
 * @param {Landingsactionassigntocampaign4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsactionassigntocampaign4: ((
  inputs?: Landingsactionassigntocampaign4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsactionassigntocampaign4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsactionassigntocampaign4 as "landingsActionAssignToCampaign" };
