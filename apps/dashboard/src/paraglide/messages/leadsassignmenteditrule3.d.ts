export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmenteditrule3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Edit rule" |
 *
 * @param {Leadsassignmenteditrule3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmenteditrule3: ((
  inputs?: Leadsassignmenteditrule3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmenteditrule3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmenteditrule3 as "leadsAssignmentEditRule" };
