export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentremoveconfirmbody3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Payment notifications will stop being read until you connect another account." |
 *
 * @param {Paymentremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentremoveconfirmbody3: ((
  inputs?: Paymentremoveconfirmbody3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentremoveconfirmbody3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentremoveconfirmbody3 as "paymentRemoveConfirmBody" };
