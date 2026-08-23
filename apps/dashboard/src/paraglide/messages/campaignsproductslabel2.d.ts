export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsproductslabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Products" |
 *
 * @param {Campaignsproductslabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsproductslabel2: ((
  inputs?: Campaignsproductslabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsproductslabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsproductslabel2 as "campaignsProductsLabel" };
