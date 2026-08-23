export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentrulestitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Lead assignment rules" |
 *
 * @param {Leadsassignmentrulestitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentrulestitle3: ((
  inputs?: Leadsassignmentrulestitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentrulestitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentrulestitle3 as "leadsAssignmentRulesTitle" };
