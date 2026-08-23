export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimportsubmitbutton3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Import" |
 *
 * @param {Landingsimportsubmitbutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimportsubmitbutton3: ((
  inputs?: Landingsimportsubmitbutton3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimportsubmitbutton3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimportsubmitbutton3 as "landingsImportSubmitButton" };
