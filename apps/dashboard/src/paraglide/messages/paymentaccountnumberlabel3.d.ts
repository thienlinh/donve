export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentaccountnumberlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Account number" |
 *
 * @param {Paymentaccountnumberlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentaccountnumberlabel3: ((
  inputs?: Paymentaccountnumberlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentaccountnumberlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentaccountnumberlabel3 as "paymentAccountNumberLabel" };
