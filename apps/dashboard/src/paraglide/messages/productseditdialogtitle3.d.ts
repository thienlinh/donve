export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productseditdialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Edit product" |
 *
 * @param {Productseditdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productseditdialogtitle3: ((
  inputs?: Productseditdialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productseditdialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productseditdialogtitle3 as "productsEditDialogTitle" };
