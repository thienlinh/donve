export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfilterdatefromlabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "From" |
 *
 * @param {Leadsfilterdatefromlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfilterdatefromlabel4: ((
  inputs?: Leadsfilterdatefromlabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfilterdatefromlabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfilterdatefromlabel4 as "leadsFilterDateFromLabel" };
