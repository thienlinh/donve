export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationdismissconfirmbody3Inputs = {};
/**
 * | output |
 * | --- |
 * | "It will be marked resolved without being attached to any order." |
 *
 * @param {Reconciliationdismissconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationdismissconfirmbody3: ((
  inputs?: Reconciliationdismissconfirmbody3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationdismissconfirmbody3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationdismissconfirmbody3 as "reconciliationDismissConfirmBody" };
