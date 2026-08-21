export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationreasonnocandidate3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No matching order" |
 *
 * @param {Reconciliationreasonnocandidate3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationreasonnocandidate3: ((
  inputs?: Reconciliationreasonnocandidate3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationreasonnocandidate3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationreasonnocandidate3 as "reconciliationReasonNoCandidate" };
