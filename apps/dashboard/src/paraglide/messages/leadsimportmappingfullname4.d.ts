export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportmappingfullname4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Full name" |
 *
 * @param {Leadsimportmappingfullname4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportmappingfullname4: ((
  inputs?: Leadsimportmappingfullname4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportmappingfullname4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportmappingfullname4 as "leadsImportMappingFullName" };
