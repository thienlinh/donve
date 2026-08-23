export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentbankbinlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Bank BIN" |
 *
 * @param {Paymentbankbinlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentbankbinlabel3: ((
  inputs?: Paymentbankbinlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentbankbinlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentbankbinlabel3 as "paymentBankBinLabel" };
