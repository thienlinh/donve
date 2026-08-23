export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectionsdescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect your own SePay account so the platform can read payment notifications — your money always lands directly in your own account." |
 *
 * @param {Paymentconnectionsdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectionsdescription2: ((
  inputs?: Paymentconnectionsdescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectionsdescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectionsdescription2 as "paymentConnectionsDescription" };
