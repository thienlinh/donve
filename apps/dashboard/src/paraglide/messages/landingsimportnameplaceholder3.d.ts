export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimportnameplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "e.g. August promo page" |
 *
 * @param {Landingsimportnameplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimportnameplaceholder3: ((
  inputs?: Landingsimportnameplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimportnameplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimportnameplaceholder3 as "landingsImportNamePlaceholder" };
