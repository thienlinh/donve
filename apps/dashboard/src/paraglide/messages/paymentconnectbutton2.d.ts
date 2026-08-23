export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect SePay" |
 *
 * @param {Paymentconnectbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectbutton2: ((
  inputs?: Paymentconnectbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectbutton2 as "paymentConnectButton" };
