export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationselectorderaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Assign to this order" |
 *
 * @param {Reconciliationselectorderaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationselectorderaction3: ((
  inputs?: Reconciliationselectorderaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationselectorderaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationselectorderaction3 as "reconciliationSelectOrderAction" };
