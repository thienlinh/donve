export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioskillsbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Skills for this page" |
 *
 * @param {Studioskillsbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioskillsbutton2: ((
  inputs?: Studioskillsbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioskillsbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioskillsbutton2 as "studioSkillsButton" };
