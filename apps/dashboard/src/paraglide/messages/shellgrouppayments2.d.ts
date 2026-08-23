export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellgrouppayments2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Payments" |
 *
 * @param {Shellgrouppayments2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellgrouppayments2: ((
  inputs?: Shellgrouppayments2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellgrouppayments2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellgrouppayments2 as "shellGroupPayments" };
