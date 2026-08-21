export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsdescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Manual refund tracking — the platform never holds funds, so you transfer the refund yourself and mark it done here." |
 *
 * @param {Refundrequestsdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsdescription2: ((
  inputs?: Refundrequestsdescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsdescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsdescription2 as "refundRequestsDescription" };
