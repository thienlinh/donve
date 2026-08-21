export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productscolumnname2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Productscolumnname2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productscolumnname2: ((
  inputs?: Productscolumnname2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productscolumnname2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productscolumnname2 as "productsColumnName" };
