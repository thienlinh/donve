export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfilterutmsourcelabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "UTM source" |
 *
 * @param {Leadsfilterutmsourcelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfilterutmsourcelabel4: ((
  inputs?: Leadsfilterutmsourcelabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfilterutmsourcelabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfilterutmsourcelabel4 as "leadsFilterUtmSourceLabel" };
