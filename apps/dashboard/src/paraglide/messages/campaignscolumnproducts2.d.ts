export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignscolumnproducts2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Products" |
 *
 * @param {Campaignscolumnproducts2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignscolumnproducts2: ((
  inputs?: Campaignscolumnproducts2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignscolumnproducts2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignscolumnproducts2 as "campaignsColumnProducts" };
