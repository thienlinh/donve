export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrstatuspending3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Pending" |
 *
 * @param {Leadsdsrstatuspending3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrstatuspending3: ((
  inputs?: Leadsdsrstatuspending3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrstatuspending3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrstatuspending3 as "leadsDsrStatusPending" };
