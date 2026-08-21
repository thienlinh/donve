export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfilterdatetolabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "To" |
 *
 * @param {Leadsfilterdatetolabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfilterdatetolabel4: ((
  inputs?: Leadsfilterdatetolabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfilterdatetolabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfilterdatetolabel4 as "leadsFilterDateToLabel" };
