export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsassignmentmodelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Lead assignment" |
 *
 * @param {Campaignsassignmentmodelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsassignmentmodelabel3: ((
  inputs?: Campaignsassignmentmodelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsassignmentmodelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsassignmentmodelabel3 as "campaignsAssignmentModeLabel" };
