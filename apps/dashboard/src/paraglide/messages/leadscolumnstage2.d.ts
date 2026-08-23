export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadscolumnstage2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Stage" |
 *
 * @param {Leadscolumnstage2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadscolumnstage2: ((
  inputs?: Leadscolumnstage2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadscolumnstage2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadscolumnstage2 as "leadsColumnStage" };
