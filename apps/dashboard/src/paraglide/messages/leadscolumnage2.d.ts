export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadscolumnage2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Age" |
 *
 * @param {Leadscolumnage2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadscolumnage2: ((
  inputs?: Leadscolumnage2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadscolumnage2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadscolumnage2 as "leadsColumnAge" };
