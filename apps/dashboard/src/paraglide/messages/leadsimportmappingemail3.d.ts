export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportmappingemail3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Leadsimportmappingemail3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportmappingemail3: ((
  inputs?: Leadsimportmappingemail3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportmappingemail3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportmappingemail3 as "leadsImportMappingEmail" };
