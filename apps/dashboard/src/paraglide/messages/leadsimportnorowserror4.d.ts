export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportnorowserror4Inputs = {};
/**
 * | output |
 * | --- |
 * | "No rows have both a name and a phone mapped — nothing to import." |
 *
 * @param {Leadsimportnorowserror4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportnorowserror4: ((
  inputs?: Leadsimportnorowserror4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportnorowserror4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportnorowserror4 as "leadsImportNoRowsError" };
