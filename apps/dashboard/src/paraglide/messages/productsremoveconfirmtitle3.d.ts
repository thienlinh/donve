export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsremoveconfirmtitle3Inputs = {
  name: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Remove {name}?" |
 *
 * @param {Productsremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsremoveconfirmtitle3: ((
  inputs: Productsremoveconfirmtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsremoveconfirmtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsremoveconfirmtitle3 as "productsRemoveConfirmTitle" };
