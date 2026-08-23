export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productstitle1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Products" |
 *
 * @param {Productstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productstitle1: ((
  inputs?: Productstitle1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productstitle1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productstitle1 as "productsTitle" };
