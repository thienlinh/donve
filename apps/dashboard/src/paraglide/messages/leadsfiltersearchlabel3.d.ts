export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfiltersearchlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Search" |
 *
 * @param {Leadsfiltersearchlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfiltersearchlabel3: ((
  inputs?: Leadsfiltersearchlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfiltersearchlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfiltersearchlabel3 as "leadsFilterSearchLabel" };
