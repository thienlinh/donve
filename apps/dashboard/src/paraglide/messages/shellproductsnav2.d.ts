export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellproductsnav2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Products" |
 *
 * @param {Shellproductsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellproductsnav2: ((
  inputs?: Shellproductsnav2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellproductsnav2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellproductsnav2 as "shellProductsNav" };
