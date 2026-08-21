export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsroverduebadge3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Overdue" |
 *
 * @param {Leadsdsroverduebadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsroverduebadge3: ((
  inputs?: Leadsdsroverduebadge3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsroverduebadge3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsroverduebadge3 as "leadsDsrOverdueBadge" };
