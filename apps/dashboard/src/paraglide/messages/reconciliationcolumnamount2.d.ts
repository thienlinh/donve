export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationcolumnamount2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Amount" |
 *
 * @param {Reconciliationcolumnamount2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationcolumnamount2: ((
  inputs?: Reconciliationcolumnamount2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationcolumnamount2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationcolumnamount2 as "reconciliationColumnAmount" };
