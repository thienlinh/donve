export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimportdialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Import landing page" |
 *
 * @param {Landingsimportdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimportdialogtitle3: ((
  inputs?: Landingsimportdialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimportdialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimportdialogtitle3 as "landingsImportDialogTitle" };
