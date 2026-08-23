export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadskanbanemptycolumn3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Drop leads here" |
 *
 * @param {Leadskanbanemptycolumn3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadskanbanemptycolumn3: ((
  inputs?: Leadskanbanemptycolumn3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadskanbanemptycolumn3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadskanbanemptycolumn3 as "leadsKanbanEmptyColumn" };
