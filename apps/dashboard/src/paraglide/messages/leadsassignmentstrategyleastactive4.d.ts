export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentstrategyleastactive4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Least active leads" |
 *
 * @param {Leadsassignmentstrategyleastactive4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentstrategyleastactive4: ((
  inputs?: Leadsassignmentstrategyleastactive4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentstrategyleastactive4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentstrategyleastactive4 as "leadsAssignmentStrategyLeastActive" };
