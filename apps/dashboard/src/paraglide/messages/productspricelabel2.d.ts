export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productspricelabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Price (VND)" |
 *
 * @param {Productspricelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productspricelabel2: ((
  inputs?: Productspricelabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productspricelabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productspricelabel2 as "productsPriceLabel" };
