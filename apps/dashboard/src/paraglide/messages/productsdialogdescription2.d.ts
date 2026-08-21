export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsdialogdescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Products can be attached to one or more campaigns." |
 *
 * @param {Productsdialogdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsdialogdescription2: ((
  inputs?: Productsdialogdescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsdialogdescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsdialogdescription2 as "productsDialogDescription" };
