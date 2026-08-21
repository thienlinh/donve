export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfilterpaidlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paid" |
 *
 * @param {Leadsfilterpaidlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfilterpaidlabel3: ((
  inputs?: Leadsfilterpaidlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfilterpaidlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfilterpaidlabel3 as "leadsFilterPaidLabel" };
