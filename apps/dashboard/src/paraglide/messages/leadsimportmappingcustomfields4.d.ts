export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportmappingcustomfields4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Custom field" |
 *
 * @param {Leadsimportmappingcustomfields4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportmappingcustomfields4: ((
  inputs?: Leadsimportmappingcustomfields4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportmappingcustomfields4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportmappingcustomfields4 as "leadsImportMappingCustomFields" };
