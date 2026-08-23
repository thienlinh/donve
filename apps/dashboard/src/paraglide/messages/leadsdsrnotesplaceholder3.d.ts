export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrnotesplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Optional notes..." |
 *
 * @param {Leadsdsrnotesplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrnotesplaceholder3: ((
  inputs?: Leadsdsrnotesplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrnotesplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrnotesplaceholder3 as "leadsDsrNotesPlaceholder" };
