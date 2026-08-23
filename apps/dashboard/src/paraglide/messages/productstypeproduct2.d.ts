export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productstypeproduct2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Product" |
 *
 * @param {Productstypeproduct2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productstypeproduct2: ((
  inputs?: Productstypeproduct2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productstypeproduct2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productstypeproduct2 as "productsTypeProduct" };
