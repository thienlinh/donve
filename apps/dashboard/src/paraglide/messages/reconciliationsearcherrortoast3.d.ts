export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationsearcherrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Order search failed. Try again." |
 *
 * @param {Reconciliationsearcherrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationsearcherrortoast3: ((
  inputs?: Reconciliationsearcherrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationsearcherrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationsearcherrortoast3 as "reconciliationSearchErrorToast" };
