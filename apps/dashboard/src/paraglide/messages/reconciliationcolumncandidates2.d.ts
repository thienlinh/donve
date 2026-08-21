export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationcolumncandidates2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Candidate orders" |
 *
 * @param {Reconciliationcolumncandidates2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationcolumncandidates2: ((
  inputs?: Reconciliationcolumncandidates2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationcolumncandidates2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationcolumncandidates2 as "reconciliationColumnCandidates" };
