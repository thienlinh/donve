export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsactionremovefromcampaign4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove from campaign" |
 *
 * @param {Landingsactionremovefromcampaign4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsactionremovefromcampaign4: ((
  inputs?: Landingsactionremovefromcampaign4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsactionremovefromcampaign4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsactionremovefromcampaign4 as "landingsActionRemoveFromCampaign" };
