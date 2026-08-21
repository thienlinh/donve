export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectionstitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Payment connections" |
 *
 * @param {Paymentconnectionstitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectionstitle2: ((
  inputs?: Paymentconnectionstitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectionstitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectionstitle2 as "paymentConnectionsTitle" };
