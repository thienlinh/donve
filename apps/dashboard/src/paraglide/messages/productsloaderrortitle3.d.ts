export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsloaderrortitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load products" |
 *
 * @param {Productsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsloaderrortitle3: ((
  inputs?: Productsloaderrortitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsloaderrortitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsloaderrortitle3 as "productsLoadErrorTitle" };
