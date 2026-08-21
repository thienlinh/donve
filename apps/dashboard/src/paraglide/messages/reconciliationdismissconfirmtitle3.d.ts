export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationdismissconfirmtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Dismiss this transaction?" |
 *
 * @param {Reconciliationdismissconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationdismissconfirmtitle3: ((
  inputs?: Reconciliationdismissconfirmtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationdismissconfirmtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationdismissconfirmtitle3 as "reconciliationDismissConfirmTitle" };
