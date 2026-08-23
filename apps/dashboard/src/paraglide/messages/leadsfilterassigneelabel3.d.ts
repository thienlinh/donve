export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfilterassigneelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Assignee" |
 *
 * @param {Leadsfilterassigneelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfilterassigneelabel3: ((
  inputs?: Leadsfilterassigneelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfilterassigneelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfilterassigneelabel3 as "leadsFilterAssigneeLabel" };
