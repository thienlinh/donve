export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignspopuppaidtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "After payment" |
 *
 * @param {Campaignspopuppaidtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignspopuppaidtitle3: ((
  inputs?: Campaignspopuppaidtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignspopuppaidtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignspopuppaidtitle3 as "campaignsPopupPaidTitle" };
