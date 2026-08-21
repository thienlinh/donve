export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationcolumntransaction2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Transaction" |
 *
 * @param {Reconciliationcolumntransaction2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationcolumntransaction2: ((
  inputs?: Reconciliationcolumntransaction2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationcolumntransaction2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationcolumntransaction2 as "reconciliationColumnTransaction" };
