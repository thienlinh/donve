export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimportbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Import" |
 *
 * @param {Landingsimportbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimportbutton2: ((
  inputs?: Landingsimportbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimportbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimportbutton2 as "landingsImportButton" };
