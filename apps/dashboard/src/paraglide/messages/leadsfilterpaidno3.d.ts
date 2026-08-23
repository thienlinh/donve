export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfilterpaidno3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Not paid" |
 *
 * @param {Leadsfilterpaidno3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfilterpaidno3: ((
  inputs?: Leadsfilterpaidno3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfilterpaidno3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfilterpaidno3 as "leadsFilterPaidNo" };
