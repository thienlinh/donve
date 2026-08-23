export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsactivitypayment2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Payment confirmed" |
 *
 * @param {Leadsactivitypayment2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsactivitypayment2: ((
  inputs?: Leadsactivitypayment2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsactivitypayment2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsactivitypayment2 as "leadsActivityPayment" };
