export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadscolumncreatedat3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Created" |
 *
 * @param {Leadscolumncreatedat3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadscolumncreatedat3: ((
  inputs?: Leadscolumncreatedat3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadscolumncreatedat3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadscolumncreatedat3 as "leadsColumnCreatedAt" };
