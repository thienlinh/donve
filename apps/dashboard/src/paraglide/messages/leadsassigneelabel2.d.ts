export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassigneelabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Assigned to" |
 *
 * @param {Leadsassigneelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassigneelabel2: ((
  inputs?: Leadsassigneelabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassigneelabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassigneelabel2 as "leadsAssigneeLabel" };
