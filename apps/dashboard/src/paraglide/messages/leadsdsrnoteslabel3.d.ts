export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrnoteslabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Notes" |
 *
 * @param {Leadsdsrnoteslabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrnoteslabel3: ((
  inputs?: Leadsdsrnoteslabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrnoteslabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrnoteslabel3 as "leadsDsrNotesLabel" };
