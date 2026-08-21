export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsimagelabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Image URL" |
 *
 * @param {Productsimagelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsimagelabel2: ((
  inputs?: Productsimagelabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsimagelabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsimagelabel2 as "productsImageLabel" };
