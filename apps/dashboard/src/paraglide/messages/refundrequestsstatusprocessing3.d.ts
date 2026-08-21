export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsstatusprocessing3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Processing" |
 *
 * @param {Refundrequestsstatusprocessing3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsstatusprocessing3: ((
  inputs?: Refundrequestsstatusprocessing3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsstatusprocessing3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsstatusprocessing3 as "refundRequestsStatusProcessing" };
