export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsassignmentmodemanual3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Manual" |
 *
 * @param {Campaignsassignmentmodemanual3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsassignmentmodemanual3: ((
  inputs?: Campaignsassignmentmodemanual3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsassignmentmodemanual3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsassignmentmodemanual3 as "campaignsAssignmentModeManual" };
