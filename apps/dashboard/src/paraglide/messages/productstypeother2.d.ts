export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productstypeother2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Other" |
 *
 * @param {Productstypeother2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productstypeother2: ((
  inputs?: Productstypeother2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productstypeother2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productstypeother2 as "productsTypeOther" };
