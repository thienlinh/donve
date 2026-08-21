export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellreconciliationnav2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Reconciliation" |
 *
 * @param {Shellreconciliationnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellreconciliationnav2: ((
  inputs?: Shellreconciliationnav2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellreconciliationnav2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellreconciliationnav2 as "shellReconciliationNav" };
