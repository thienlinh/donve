export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimporttabhtml3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paste HTML" |
 *
 * @param {Landingsimporttabhtml3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimporttabhtml3: ((
  inputs?: Landingsimporttabhtml3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimporttabhtml3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimporttabhtml3 as "landingsImportTabHtml" };
