export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsremoveconfirmbody3Inputs = {};
/**
 * | output |
 * | --- |
 * | "This product will no longer be available to attach to campaigns." |
 *
 * @param {Productsremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsremoveconfirmbody3: ((
  inputs?: Productsremoveconfirmbody3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsremoveconfirmbody3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsremoveconfirmbody3 as "productsRemoveConfirmBody" };
