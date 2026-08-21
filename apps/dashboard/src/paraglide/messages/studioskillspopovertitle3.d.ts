export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioskillspopovertitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Skills for this page" |
 *
 * @param {Studioskillspopovertitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioskillspopovertitle3: ((
  inputs?: Studioskillspopovertitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioskillspopovertitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioskillspopovertitle3 as "studioSkillsPopoverTitle" };
