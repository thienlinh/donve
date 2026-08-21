export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportmappingskip3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Ignore column" |
 *
 * @param {Leadsimportmappingskip3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportmappingskip3: ((
  inputs?: Leadsimportmappingskip3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportmappingskip3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportmappingskip3 as "leadsImportMappingSkip" };
