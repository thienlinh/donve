export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentstrategyroundrobin4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Round robin" |
 *
 * @param {Leadsassignmentstrategyroundrobin4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentstrategyroundrobin4: ((
  inputs?: Leadsassignmentstrategyroundrobin4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentstrategyroundrobin4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentstrategyroundrobin4 as "leadsAssignmentStrategyRoundRobin" };
