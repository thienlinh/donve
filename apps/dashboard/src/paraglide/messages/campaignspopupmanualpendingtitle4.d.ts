export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignspopupmanualpendingtitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Awaiting manual confirmation" |
 *
 * @param {Campaignspopupmanualpendingtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignspopupmanualpendingtitle4: ((
  inputs?: Campaignspopupmanualpendingtitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignspopupmanualpendingtitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignspopupmanualpendingtitle4 as "campaignsPopupManualPendingTitle" };
