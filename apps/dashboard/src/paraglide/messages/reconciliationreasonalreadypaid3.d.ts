export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationreasonalreadypaid3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Order already paid" |
 *
 * @param {Reconciliationreasonalreadypaid3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationreasonalreadypaid3: ((
  inputs?: Reconciliationreasonalreadypaid3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationreasonalreadypaid3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationreasonalreadypaid3 as "reconciliationReasonAlreadyPaid" };
