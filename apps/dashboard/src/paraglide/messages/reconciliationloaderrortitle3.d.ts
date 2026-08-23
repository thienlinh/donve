export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationloaderrortitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load unmatched transactions" |
 *
 * @param {Reconciliationloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationloaderrortitle3: ((
  inputs?: Reconciliationloaderrortitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationloaderrortitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationloaderrortitle3 as "reconciliationLoadErrorTitle" };
