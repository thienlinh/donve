export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsemptytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No refund requests" |
 *
 * @param {Refundrequestsemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsemptytitle3: ((
  inputs?: Refundrequestsemptytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsemptytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsemptytitle3 as "refundRequestsEmptyTitle" };
