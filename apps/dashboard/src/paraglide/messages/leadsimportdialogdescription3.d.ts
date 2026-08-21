export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportdialogdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Upload a .csv file, map its columns to lead fields, and choose which campaign to attribute the imported leads to." |
 *
 * @param {Leadsimportdialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportdialogdescription3: ((
  inputs?: Leadsimportdialogdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportdialogdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportdialogdescription3 as "leadsImportDialogDescription" };
