export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnecterrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't connect this account. Check the details and try again." |
 *
 * @param {Paymentconnecterrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnecterrortoast3: ((
  inputs?: Paymentconnecterrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnecterrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnecterrortoast3 as "paymentConnectErrorToast" };
