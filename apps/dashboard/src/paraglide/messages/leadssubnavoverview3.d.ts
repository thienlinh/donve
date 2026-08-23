export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadssubnavoverview3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Overview" |
 *
 * @param {Leadssubnavoverview3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadssubnavoverview3: ((
  inputs?: Leadssubnavoverview3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadssubnavoverview3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadssubnavoverview3 as "leadsSubNavOverview" };
