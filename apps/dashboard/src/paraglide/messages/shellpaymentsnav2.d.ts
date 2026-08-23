export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellpaymentsnav2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Payments" |
 *
 * @param {Shellpaymentsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellpaymentsnav2: ((
  inputs?: Shellpaymentsnav2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellpaymentsnav2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellpaymentsnav2 as "shellPaymentsNav" };
