export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsreasoncustomer3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Customer request" |
 *
 * @param {Refundrequestsreasoncustomer3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsreasoncustomer3: ((
  inputs?: Refundrequestsreasoncustomer3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsreasoncustomer3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsreasoncustomer3 as "refundRequestsReasonCustomer" };
