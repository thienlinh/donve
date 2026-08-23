export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentrulesdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "New leads are auto-assigned by the first matching rule below, in priority order." |
 *
 * @param {Leadsassignmentrulesdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentrulesdescription3: ((
  inputs?: Leadsassignmentrulesdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentrulesdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentrulesdescription3 as "leadsAssignmentRulesDescription" };
