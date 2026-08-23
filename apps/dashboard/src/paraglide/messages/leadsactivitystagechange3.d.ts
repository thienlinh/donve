export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsactivitystagechange3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Stage changed" |
 *
 * @param {Leadsactivitystagechange3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsactivitystagechange3: ((
  inputs?: Leadsactivitystagechange3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsactivitystagechange3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsactivitystagechange3 as "leadsActivityStageChange" };
