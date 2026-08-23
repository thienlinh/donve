export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationsearchplaceholder2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Search by order code or phone" |
 *
 * @param {Reconciliationsearchplaceholder2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationsearchplaceholder2: ((
  inputs?: Reconciliationsearchplaceholder2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationsearchplaceholder2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationsearchplaceholder2 as "reconciliationSearchPlaceholder" };
