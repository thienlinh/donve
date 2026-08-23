export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsviewkanban2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Kanban" |
 *
 * @param {Leadsviewkanban2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsviewkanban2: ((
  inputs?: Leadsviewkanban2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsviewkanban2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsviewkanban2 as "leadsViewKanban" };
