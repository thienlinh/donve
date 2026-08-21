export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignspopupssectiontitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Popups" |
 *
 * @param {Campaignspopupssectiontitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignspopupssectiontitle3: ((
  inputs?: Campaignspopupssectiontitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignspopupssectiontitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignspopupssectiontitle3 as "campaignsPopupsSectionTitle" };
