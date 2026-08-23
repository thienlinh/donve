export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectioncolumnbank3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Bank BIN" |
 *
 * @param {Paymentconnectioncolumnbank3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectioncolumnbank3: ((
  inputs?: Paymentconnectioncolumnbank3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectioncolumnbank3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectioncolumnbank3 as "paymentConnectionColumnBank" };
