export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyesmsbrandnamelabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Brandname (optional)" |
 *
 * @param {Leadsnotifyesmsbrandnamelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyesmsbrandnamelabel4: ((
  inputs?: Leadsnotifyesmsbrandnamelabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyesmsbrandnamelabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyesmsbrandnamelabel4 as "leadsNotifyEsmsBrandnameLabel" };
