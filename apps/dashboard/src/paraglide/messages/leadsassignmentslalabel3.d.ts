export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentslalabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "SLA (hours, optional)" |
 *
 * @param {Leadsassignmentslalabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentslalabel3: ((
  inputs?: Leadsassignmentslalabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentslalabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentslalabel3 as "leadsAssignmentSlaLabel" };
