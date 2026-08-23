export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimportsubmitting2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Importing…" |
 *
 * @param {Landingsimportsubmitting2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimportsubmitting2: ((
  inputs?: Landingsimportsubmitting2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimportsubmitting2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimportsubmitting2 as "landingsImportSubmitting" };
