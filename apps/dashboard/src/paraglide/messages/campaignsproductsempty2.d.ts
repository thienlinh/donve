export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsproductsempty2Inputs = {};
/**
 * | output |
 * | --- |
 * | "No products yet — add one first." |
 *
 * @param {Campaignsproductsempty2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsproductsempty2: ((
  inputs?: Campaignsproductsempty2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsproductsempty2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsproductsempty2 as "campaignsProductsEmpty" };
