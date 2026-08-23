export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsadddialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add a product" |
 *
 * @param {Productsadddialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsadddialogtitle3: ((
  inputs?: Productsadddialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsadddialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsadddialogtitle3 as "productsAddDialogTitle" };
