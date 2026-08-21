export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationemptytitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "No unmatched transactions" |
 *
 * @param {Reconciliationemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationemptytitle2: ((
  inputs?: Reconciliationemptytitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationemptytitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationemptytitle2 as "reconciliationEmptyTitle" };
