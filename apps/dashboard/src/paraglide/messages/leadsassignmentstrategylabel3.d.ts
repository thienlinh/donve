export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentstrategylabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Strategy" |
 *
 * @param {Leadsassignmentstrategylabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentstrategylabel3: ((
  inputs?: Leadsassignmentstrategylabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentstrategylabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentstrategylabel3 as "leadsAssignmentStrategyLabel" };
