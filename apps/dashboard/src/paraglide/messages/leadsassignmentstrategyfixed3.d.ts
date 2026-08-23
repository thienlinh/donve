export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentstrategyfixed3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Fixed assignee" |
 *
 * @param {Leadsassignmentstrategyfixed3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentstrategyfixed3: ((
  inputs?: Leadsassignmentstrategyfixed3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentstrategyfixed3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentstrategyfixed3 as "leadsAssignmentStrategyFixed" };
