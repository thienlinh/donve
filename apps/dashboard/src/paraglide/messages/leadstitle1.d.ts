export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadstitle1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Leads" |
 *
 * @param {Leadstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadstitle1: ((
  inputs?: Leadstitle1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadstitle1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadstitle1 as "leadsTitle" };
