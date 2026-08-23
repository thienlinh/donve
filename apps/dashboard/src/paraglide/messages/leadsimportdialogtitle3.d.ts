export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportdialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Import leads from CSV" |
 *
 * @param {Leadsimportdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportdialogtitle3: ((
  inputs?: Leadsimportdialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportdialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportdialogtitle3 as "leadsImportDialogTitle" };
