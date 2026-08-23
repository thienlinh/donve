export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationsearchbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Search" |
 *
 * @param {Reconciliationsearchbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationsearchbutton2: ((
  inputs?: Reconciliationsearchbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationsearchbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationsearchbutton2 as "reconciliationSearchButton" };
