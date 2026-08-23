export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentaccountnamelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Account holder name" |
 *
 * @param {Paymentaccountnamelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentaccountnamelabel3: ((
  inputs?: Paymentaccountnamelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentaccountnamelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentaccountnamelabel3 as "paymentAccountNameLabel" };
