export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsuploadevidencebutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Upload receipt photo" |
 *
 * @param {Refundrequestsuploadevidencebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsuploadevidencebutton4: ((
  inputs?: Refundrequestsuploadevidencebutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsuploadevidencebutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsuploadevidencebutton4 as "refundRequestsUploadEvidenceButton" };
