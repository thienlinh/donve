export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfilterpaidyes3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paid" |
 *
 * @param {Leadsfilterpaidyes3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfilterpaidyes3: ((
  inputs?: Leadsfilterpaidyes3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfilterpaidyes3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfilterpaidyes3 as "leadsFilterPaidYes" };
