export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentremoveconnectionaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove connection" |
 *
 * @param {Paymentremoveconnectionaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentremoveconnectionaction3: ((
  inputs?: Paymentremoveconnectionaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentremoveconnectionaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentremoveconnectionaction3 as "paymentRemoveConnectionAction" };
