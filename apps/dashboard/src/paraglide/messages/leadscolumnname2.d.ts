export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadscolumnname2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Leadscolumnname2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadscolumnname2: ((
  inputs?: Leadscolumnname2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadscolumnname2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadscolumnname2 as "leadsColumnName" };
