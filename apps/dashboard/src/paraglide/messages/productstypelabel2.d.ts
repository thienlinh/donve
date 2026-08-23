export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productstypelabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Type" |
 *
 * @param {Productstypelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productstypelabel2: ((
  inputs?: Productstypelabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productstypelabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productstypelabel2 as "productsTypeLabel" };
