export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrsectionlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Data-subject requests" |
 *
 * @param {Leadsdsrsectionlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrsectionlabel3: ((
  inputs?: Leadsdsrsectionlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrsectionlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrsectionlabel3 as "leadsDsrSectionLabel" };
