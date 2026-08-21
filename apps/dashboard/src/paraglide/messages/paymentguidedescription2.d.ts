export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentguidedescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Step-by-step, from creating a SePay account to confirming the connection works." |
 *
 * @param {Paymentguidedescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentguidedescription2: ((
  inputs?: Paymentguidedescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentguidedescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentguidedescription2 as "paymentGuideDescription" };
