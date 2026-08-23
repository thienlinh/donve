export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsemptytitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "No products yet" |
 *
 * @param {Productsemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsemptytitle2: ((
  inputs?: Productsemptytitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsemptytitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsemptytitle2 as "productsEmptyTitle" };
