export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationreasonambiguous2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Ambiguous match" |
 *
 * @param {Reconciliationreasonambiguous2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationreasonambiguous2: ((
  inputs?: Reconciliationreasonambiguous2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationreasonambiguous2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationreasonambiguous2 as "reconciliationReasonAmbiguous" };
