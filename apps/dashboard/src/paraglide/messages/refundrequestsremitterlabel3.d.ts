export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsremitterlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remitter" |
 *
 * @param {Refundrequestsremitterlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsremitterlabel3: ((
  inputs?: Refundrequestsremitterlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsremitterlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsremitterlabel3 as "refundRequestsRemitterLabel" };
