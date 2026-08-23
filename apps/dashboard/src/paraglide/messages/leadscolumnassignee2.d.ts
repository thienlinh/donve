export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadscolumnassignee2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Assignee" |
 *
 * @param {Leadscolumnassignee2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadscolumnassignee2: ((
  inputs?: Leadscolumnassignee2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadscolumnassignee2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadscolumnassignee2 as "leadsColumnAssignee" };
