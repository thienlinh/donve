export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestscolumnorder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Order" |
 *
 * @param {Refundrequestscolumnorder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestscolumnorder3: ((
  inputs?: Refundrequestscolumnorder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestscolumnorder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestscolumnorder3 as "refundRequestsColumnOrder" };
