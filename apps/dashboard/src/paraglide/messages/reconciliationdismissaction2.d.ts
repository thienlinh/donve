export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationdismissaction2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Dismiss" |
 *
 * @param {Reconciliationdismissaction2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationdismissaction2: ((
  inputs?: Reconciliationdismissaction2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationdismissaction2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationdismissaction2 as "reconciliationDismissAction" };
