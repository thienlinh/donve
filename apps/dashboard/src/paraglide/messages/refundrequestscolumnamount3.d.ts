export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestscolumnamount3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Amount" |
 *
 * @param {Refundrequestscolumnamount3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestscolumnamount3: ((
  inputs?: Refundrequestscolumnamount3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestscolumnamount3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestscolumnamount3 as "refundRequestsColumnAmount" };
