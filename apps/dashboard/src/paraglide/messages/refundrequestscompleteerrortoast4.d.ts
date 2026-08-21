export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestscompleteerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't mark this refund as transferred. Try again." |
 *
 * @param {Refundrequestscompleteerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestscompleteerrortoast4: ((
  inputs?: Refundrequestscompleteerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestscompleteerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestscompleteerrortoast4 as "refundRequestsCompleteErrorToast" };
