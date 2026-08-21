export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportsubmit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Import" |
 *
 * @param {Leadsimportsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportsubmit2: ((
  inputs?: Leadsimportsubmit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportsubmit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportsubmit2 as "leadsImportSubmit" };
