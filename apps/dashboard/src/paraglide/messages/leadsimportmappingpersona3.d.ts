export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportmappingpersona3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Persona" |
 *
 * @param {Leadsimportmappingpersona3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportmappingpersona3: ((
  inputs?: Leadsimportmappingpersona3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportmappingpersona3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportmappingpersona3 as "leadsImportMappingPersona" };
