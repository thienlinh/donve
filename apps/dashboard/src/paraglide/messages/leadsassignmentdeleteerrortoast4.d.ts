export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentdeleteerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't delete this rule. Try again." |
 *
 * @param {Leadsassignmentdeleteerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentdeleteerrortoast4: ((
  inputs?: Leadsassignmentdeleteerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentdeleteerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentdeleteerrortoast4 as "leadsAssignmentDeleteErrorToast" };
