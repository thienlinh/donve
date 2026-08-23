export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentpoollabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Assignee pool" |
 *
 * @param {Leadsassignmentpoollabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentpoollabel3: ((
  inputs?: Leadsassignmentpoollabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentpoollabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentpoollabel3 as "leadsAssignmentPoolLabel" };
