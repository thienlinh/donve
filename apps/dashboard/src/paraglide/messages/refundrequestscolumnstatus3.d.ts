export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestscolumnstatus3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Refundrequestscolumnstatus3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestscolumnstatus3: ((
  inputs?: Refundrequestscolumnstatus3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestscolumnstatus3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestscolumnstatus3 as "refundRequestsColumnStatus" };
