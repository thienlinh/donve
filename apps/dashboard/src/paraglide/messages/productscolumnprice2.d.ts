export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productscolumnprice2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Price" |
 *
 * @param {Productscolumnprice2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productscolumnprice2: ((
  inputs?: Productscolumnprice2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productscolumnprice2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productscolumnprice2 as "productsColumnPrice" };
