export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectioncolumnactions3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Paymentconnectioncolumnactions3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectioncolumnactions3: ((
  inputs?: Paymentconnectioncolumnactions3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectioncolumnactions3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectioncolumnactions3 as "paymentConnectionColumnActions" };
