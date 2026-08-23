export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectioncolumnaccount3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Account" |
 *
 * @param {Paymentconnectioncolumnaccount3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectioncolumnaccount3: ((
  inputs?: Paymentconnectioncolumnaccount3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectioncolumnaccount3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectioncolumnaccount3 as "paymentConnectionColumnAccount" };
