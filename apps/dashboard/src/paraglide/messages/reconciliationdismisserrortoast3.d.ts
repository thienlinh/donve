export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationdismisserrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't dismiss this transaction. Try again." |
 *
 * @param {Reconciliationdismisserrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationdismisserrortoast3: ((
  inputs?: Reconciliationdismisserrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationdismisserrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationdismisserrortoast3 as "reconciliationDismissErrorToast" };
