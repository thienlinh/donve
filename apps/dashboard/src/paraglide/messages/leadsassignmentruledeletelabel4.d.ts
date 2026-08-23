export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentruledeletelabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Delete rule" |
 *
 * @param {Leadsassignmentruledeletelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentruledeletelabel4: ((
  inputs?: Leadsassignmentruledeletelabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentruledeletelabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentruledeletelabel4 as "leadsAssignmentRuleDeleteLabel" };
