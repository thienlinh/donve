export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentaddrule3Inputs = {};
/**
 * | output |
 * | --- |
 * | "+ Add rule" |
 *
 * @param {Leadsassignmentaddrule3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentaddrule3: ((
  inputs?: Leadsassignmentaddrule3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentaddrule3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentaddrule3 as "leadsAssignmentAddRule" };
