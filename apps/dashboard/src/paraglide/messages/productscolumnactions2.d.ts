export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productscolumnactions2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Productscolumnactions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productscolumnactions2: ((
  inputs?: Productscolumnactions2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productscolumnactions2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productscolumnactions2 as "productsColumnActions" };
