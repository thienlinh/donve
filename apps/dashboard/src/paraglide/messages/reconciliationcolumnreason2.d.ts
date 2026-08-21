export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationcolumnreason2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Reason" |
 *
 * @param {Reconciliationcolumnreason2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationcolumnreason2: ((
  inputs?: Reconciliationcolumnreason2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationcolumnreason2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationcolumnreason2 as "reconciliationColumnReason" };
