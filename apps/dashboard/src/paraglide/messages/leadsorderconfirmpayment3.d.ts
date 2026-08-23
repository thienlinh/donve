export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsorderconfirmpayment3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Confirm payment" |
 *
 * @param {Leadsorderconfirmpayment3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsorderconfirmpayment3: ((
  inputs?: Leadsorderconfirmpayment3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsorderconfirmpayment3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsorderconfirmpayment3 as "leadsOrderConfirmPayment" };
