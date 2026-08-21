export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsnamelabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Productsnamelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsnamelabel2: ((
  inputs?: Productsnamelabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsnamelabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsnamelabel2 as "productsNameLabel" };
