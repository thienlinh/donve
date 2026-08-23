export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentsaveerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't save this rule. Try again." |
 *
 * @param {Leadsassignmentsaveerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentsaveerrortoast4: ((
  inputs?: Leadsassignmentsaveerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentsaveerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentsaveerrortoast4 as "leadsAssignmentSaveErrorToast" };
