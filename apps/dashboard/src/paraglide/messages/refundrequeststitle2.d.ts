export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequeststitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Refund requests" |
 *
 * @param {Refundrequeststitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequeststitle2: ((
  inputs?: Refundrequeststitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequeststitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequeststitle2 as "refundRequestsTitle" };
