export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignspopuptitlelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Popup title" |
 *
 * @param {Campaignspopuptitlelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignspopuptitlelabel3: ((
  inputs?: Campaignspopuptitlelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignspopuptitlelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignspopuptitlelabel3 as "campaignsPopupTitleLabel" };
