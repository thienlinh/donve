export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectioncolumnstatus3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Paymentconnectioncolumnstatus3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectioncolumnstatus3: ((
  inputs?: Paymentconnectioncolumnstatus3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectioncolumnstatus3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectioncolumnstatus3 as "paymentConnectionColumnStatus" };
