export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsorderreasonconfirm3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Confirm" |
 *
 * @param {Leadsorderreasonconfirm3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsorderreasonconfirm3: ((
  inputs?: Leadsorderreasonconfirm3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsorderreasonconfirm3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsorderreasonconfirm3 as "leadsOrderReasonConfirm" };
