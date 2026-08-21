export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsremoveconfirmaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove product" |
 *
 * @param {Productsremoveconfirmaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsremoveconfirmaction3: ((
  inputs?: Productsremoveconfirmaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsremoveconfirmaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsremoveconfirmaction3 as "productsRemoveConfirmAction" };
