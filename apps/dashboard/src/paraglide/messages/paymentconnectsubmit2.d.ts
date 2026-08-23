export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectsubmit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect" |
 *
 * @param {Paymentconnectsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectsubmit2: ((
  inputs?: Paymentconnectsubmit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectsubmit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectsubmit2 as "paymentConnectSubmit" };
