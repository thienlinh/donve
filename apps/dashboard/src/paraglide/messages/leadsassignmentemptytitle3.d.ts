export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignmentemptytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No assignment rules yet" |
 *
 * @param {Leadsassignmentemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignmentemptytitle3: ((
  inputs?: Leadsassignmentemptytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignmentemptytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignmentemptytitle3 as "leadsAssignmentEmptyTitle" };
