export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentpersonalabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Persona (optional)" |
 *
 * @param {Leadsassignmentpersonalabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentpersonalabel3: ((
  inputs?: Leadsassignmentpersonalabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentpersonalabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentpersonalabel3 as "leadsAssignmentPersonaLabel" };
