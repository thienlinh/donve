export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentreordererrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't save the new priority order. Try again." |
 *
 * @param {Leadsassignmentreordererrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentreordererrortoast4: ((
  inputs?: Leadsassignmentreordererrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentreordererrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentreordererrortoast4 as "leadsAssignmentReorderErrorToast" };
