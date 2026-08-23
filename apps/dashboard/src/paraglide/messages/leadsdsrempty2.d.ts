export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrempty2Inputs = {};
/**
 * | output |
 * | --- |
 * | "No data-subject requests logged for this lead." |
 *
 * @param {Leadsdsrempty2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrempty2: ((
  inputs?: Leadsdsrempty2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrempty2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrempty2 as "leadsDsrEmpty" };
