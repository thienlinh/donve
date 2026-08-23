export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsevidencelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Transfer receipt" |
 *
 * @param {Refundrequestsevidencelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsevidencelabel3: ((
  inputs?: Refundrequestsevidencelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsevidencelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsevidencelabel3 as "refundRequestsEvidenceLabel" };
