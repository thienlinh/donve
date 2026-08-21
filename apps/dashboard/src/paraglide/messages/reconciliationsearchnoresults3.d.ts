export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationsearchnoresults3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No matching orders" |
 *
 * @param {Reconciliationsearchnoresults3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationsearchnoresults3: ((
  inputs?: Reconciliationsearchnoresults3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationsearchnoresults3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationsearchnoresults3 as "reconciliationSearchNoResults" };
