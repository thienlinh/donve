export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestscolumnreason3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Reason" |
 *
 * @param {Refundrequestscolumnreason3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestscolumnreason3: ((
  inputs?: Refundrequestscolumnreason3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestscolumnreason3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestscolumnreason3 as "refundRequestsColumnReason" };
