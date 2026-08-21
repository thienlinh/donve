export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsorderreasonplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Why are you changing this order's status?" |
 *
 * @param {Leadsorderreasonplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsorderreasonplaceholder3: ((
  inputs?: Leadsorderreasonplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsorderreasonplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsorderreasonplaceholder3 as "leadsOrderReasonPlaceholder" };
