export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportuploadlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "CSV file" |
 *
 * @param {Leadsimportuploadlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportuploadlabel3: ((
  inputs?: Leadsimportuploadlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportuploadlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportuploadlabel3 as "leadsImportUploadLabel" };
