export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsstatusrejected3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Rejected" |
 *
 * @param {Refundrequestsstatusrejected3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsstatusrejected3: ((
  inputs?: Refundrequestsstatusrejected3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsstatusrejected3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsstatusrejected3 as "refundRequestsStatusRejected" };
