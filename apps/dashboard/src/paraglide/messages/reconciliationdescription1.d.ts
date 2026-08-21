export type LocalizedString = import("../runtime.js").LocalizedString;
export type Reconciliationdescription1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Unmatched bank transfers — pick the right order for ambiguous matches, or leave for review otherwise." |
 *
 * @param {Reconciliationdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const reconciliationdescription1: ((
  inputs?: Reconciliationdescription1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Reconciliationdescription1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { reconciliationdescription1 as "reconciliationDescription" };
