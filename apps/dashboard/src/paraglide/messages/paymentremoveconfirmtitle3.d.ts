export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentremoveconfirmtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove this connection?" |
 *
 * @param {Paymentremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentremoveconfirmtitle3: ((
  inputs?: Paymentremoveconfirmtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentremoveconfirmtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentremoveconfirmtitle3 as "paymentRemoveConfirmTitle" };
