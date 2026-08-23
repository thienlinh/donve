export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productstypeservice2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Service" |
 *
 * @param {Productstypeservice2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productstypeservice2: ((
  inputs?: Productstypeservice2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productstypeservice2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productstypeservice2 as "productsTypeService" };
