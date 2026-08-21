export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillstitle1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Skills" |
 *
 * @param {Skillstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillstitle1: ((
  inputs?: Skillstitle1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillstitle1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillstitle1 as "skillsTitle" };
