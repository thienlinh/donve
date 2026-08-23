export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsassignmentmoderoundrobin4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Round-robin (auto)" |
 *
 * @param {Campaignsassignmentmoderoundrobin4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsassignmentmoderoundrobin4: ((
  inputs?: Campaignsassignmentmoderoundrobin4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsassignmentmoderoundrobin4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsassignmentmoderoundrobin4 as "campaignsAssignmentModeRoundRobin" };
