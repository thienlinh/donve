export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadscolumnphone2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Phone" |
 *
 * @param {Leadscolumnphone2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadscolumnphone2: ((
  inputs?: Leadscolumnphone2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadscolumnphone2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadscolumnphone2 as "leadsColumnPhone" };
