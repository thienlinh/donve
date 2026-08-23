export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationresolveerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't assign this transaction. Try again." |
 *
 * @param {Reconciliationresolveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationresolveerrortoast3: ((
  inputs?: Reconciliationresolveerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationresolveerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationresolveerrortoast3 as "reconciliationResolveErrorToast" };
