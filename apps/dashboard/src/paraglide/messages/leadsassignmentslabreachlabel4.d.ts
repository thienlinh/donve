export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentslabreachlabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "On SLA breach" |
 *
 * @param {Leadsassignmentslabreachlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentslabreachlabel4: ((
  inputs?: Leadsassignmentslabreachlabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentslabreachlabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentslabreachlabel4 as "leadsAssignmentSlaBreachLabel" };
