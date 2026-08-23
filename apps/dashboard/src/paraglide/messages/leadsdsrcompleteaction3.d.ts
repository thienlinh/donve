export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrcompleteaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Mark handled" |
 *
 * @param {Leadsdsrcompleteaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrcompleteaction3: ((
  inputs?: Leadsdsrcompleteaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrcompleteaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrcompleteaction3 as "leadsDsrCompleteAction" };
