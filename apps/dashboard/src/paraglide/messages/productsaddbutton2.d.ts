export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsaddbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add product" |
 *
 * @param {Productsaddbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsaddbutton2: ((
  inputs?: Productsaddbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsaddbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsaddbutton2 as "productsAddButton" };
