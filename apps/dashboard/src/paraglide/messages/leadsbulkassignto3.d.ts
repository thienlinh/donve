export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkassignto3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Assign to" |
 *
 * @param {Leadsbulkassignto3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkassignto3: ((
  inputs?: Leadsbulkassignto3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkassignto3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkassignto3 as "leadsBulkAssignTo" };
