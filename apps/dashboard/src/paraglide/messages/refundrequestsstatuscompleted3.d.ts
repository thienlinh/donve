export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsstatuscompleted3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Completed" |
 *
 * @param {Refundrequestsstatuscompleted3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsstatuscompleted3: ((
  inputs?: Refundrequestsstatuscompleted3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsstatuscompleted3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsstatuscompleted3 as "refundRequestsStatusCompleted" };
