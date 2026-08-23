export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsexportbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Export CSV" |
 *
 * @param {Leadsexportbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsexportbutton2: ((
  inputs?: Leadsexportbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsexportbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsexportbutton2 as "leadsExportButton" };
