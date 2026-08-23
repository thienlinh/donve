export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadssavedviewnamelabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "View name" |
 *
 * @param {Leadssavedviewnamelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadssavedviewnamelabel4: ((
  inputs?: Leadssavedviewnamelabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadssavedviewnamelabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadssavedviewnamelabel4 as "leadsSavedViewNameLabel" };
