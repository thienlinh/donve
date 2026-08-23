export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentpersonaplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Match against the lead's persona" |
 *
 * @param {Leadsassignmentpersonaplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentpersonaplaceholder3: ((
  inputs?: Leadsassignmentpersonaplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentpersonaplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentpersonaplaceholder3 as "leadsAssignmentPersonaPlaceholder" };
