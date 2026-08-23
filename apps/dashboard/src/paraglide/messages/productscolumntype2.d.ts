export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productscolumntype2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Type" |
 *
 * @param {Productscolumntype2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productscolumntype2: ((
  inputs?: Productscolumntype2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productscolumntype2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productscolumntype2 as "productsColumnType" };
