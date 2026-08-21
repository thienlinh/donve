export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsstatuspending3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Pending" |
 *
 * @param {Refundrequestsstatuspending3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsstatuspending3: ((
  inputs?: Refundrequestsstatuspending3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsstatuspending3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsstatuspending3 as "refundRequestsStatusPending" };
