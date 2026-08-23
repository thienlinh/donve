export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsreasonduplicatepayment4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Duplicate payment" |
 *
 * @param {Refundrequestsreasonduplicatepayment4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsreasonduplicatepayment4: ((
  inputs?: Refundrequestsreasonduplicatepayment4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsreasonduplicatepayment4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsreasonduplicatepayment4 as "refundRequestsReasonDuplicatePayment" };
