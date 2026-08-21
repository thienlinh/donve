export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrduelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Due" |
 *
 * @param {Leadsdsrduelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrduelabel3: ((
  inputs?: Leadsdsrduelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrduelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrduelabel3 as "leadsDsrDueLabel" };
