export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationtitle1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Reconciliation" |
 *
 * @param {Reconciliationtitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationtitle1: ((
  inputs?: Reconciliationtitle1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationtitle1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationtitle1 as "reconciliationTitle" };
