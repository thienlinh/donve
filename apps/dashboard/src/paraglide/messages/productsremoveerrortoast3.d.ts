export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsremoveerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't remove this product. Try again." |
 *
 * @param {Productsremoveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsremoveerrortoast3: ((
  inputs?: Productsremoveerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsremoveerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsremoveerrortoast3 as "productsRemoveErrorToast" };
