export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsuploaderrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't upload the receipt photo. Try again." |
 *
 * @param {Refundrequestsuploaderrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsuploaderrortoast4: ((
  inputs?: Refundrequestsuploaderrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsuploaderrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsuploaderrortoast4 as "refundRequestsUploadErrorToast" };
