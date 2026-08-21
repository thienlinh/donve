export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportmappingphone3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Phone" |
 *
 * @param {Leadsimportmappingphone3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportmappingphone3: ((
  inputs?: Leadsimportmappingphone3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportmappingphone3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportmappingphone3 as "leadsImportMappingPhone" };
