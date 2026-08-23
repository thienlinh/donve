export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignspopupbodylabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Popup body" |
 *
 * @param {Campaignspopupbodylabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignspopupbodylabel3: ((
  inputs?: Campaignspopupbodylabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignspopupbodylabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignspopupbodylabel3 as "campaignsPopupBodyLabel" };
