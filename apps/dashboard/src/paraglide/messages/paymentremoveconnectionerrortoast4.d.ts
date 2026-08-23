export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentremoveconnectionerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't remove this connection. Try again." |
 *
 * @param {Paymentremoveconnectionerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentremoveconnectionerrortoast4: ((
  inputs?: Paymentremoveconnectionerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentremoveconnectionerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentremoveconnectionerrortoast4 as "paymentRemoveConnectionErrorToast" };
