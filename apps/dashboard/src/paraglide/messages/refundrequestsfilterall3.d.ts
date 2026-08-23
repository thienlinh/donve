export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsfilterall3Inputs = {};
/**
 * | output |
 * | --- |
 * | "All statuses" |
 *
 * @param {Refundrequestsfilterall3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsfilterall3: ((
  inputs?: Refundrequestsfilterall3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsfilterall3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsfilterall3 as "refundRequestsFilterAll" };
