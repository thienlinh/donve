export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsloaderrortitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load refund requests" |
 *
 * @param {Refundrequestsloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsloaderrortitle4: ((
  inputs?: Refundrequestsloaderrortitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsloaderrortitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsloaderrortitle4 as "refundRequestsLoadErrorTitle" };
