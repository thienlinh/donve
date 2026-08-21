export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Import CSV" |
 *
 * @param {Leadsimportbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportbutton2: ((
  inputs?: Leadsimportbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportbutton2 as "leadsImportButton" };
