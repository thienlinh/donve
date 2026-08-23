export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignspopupregisteredtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "After registration" |
 *
 * @param {Campaignspopupregisteredtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignspopupregisteredtitle3: ((
  inputs?: Campaignspopupregisteredtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignspopupregisteredtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignspopupregisteredtitle3 as "campaignsPopupRegisteredTitle" };
