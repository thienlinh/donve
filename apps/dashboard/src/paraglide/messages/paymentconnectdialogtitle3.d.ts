export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectdialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect your SePay account" |
 *
 * @param {Paymentconnectdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectdialogtitle3: ((
  inputs?: Paymentconnectdialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectdialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectdialogtitle3 as "paymentConnectDialogTitle" };
