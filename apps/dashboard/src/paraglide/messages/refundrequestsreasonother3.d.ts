export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsreasonother3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Other" |
 *
 * @param {Refundrequestsreasonother3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsreasonother3: ((
  inputs?: Refundrequestsreasonother3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsreasonother3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsreasonother3 as "refundRequestsReasonOther" };
