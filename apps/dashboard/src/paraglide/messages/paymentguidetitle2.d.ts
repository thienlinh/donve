export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentguidetitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "How to connect SePay" |
 *
 * @param {Paymentguidetitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentguidetitle2: ((
  inputs?: Paymentguidetitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentguidetitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentguidetitle2 as "paymentGuideTitle" };
