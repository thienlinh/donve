export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadssubnavassignmentrules4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Assignment rules" |
 *
 * @param {Leadssubnavassignmentrules4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadssubnavassignmentrules4: ((
  inputs?: Leadssubnavassignmentrules4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadssubnavassignmentrules4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadssubnavassignmentrules4 as "leadsSubNavAssignmentRules" };
