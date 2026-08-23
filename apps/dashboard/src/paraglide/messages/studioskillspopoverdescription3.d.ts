export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioskillspopoverdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Override the org default for just this landing page." |
 *
 * @param {Studioskillspopoverdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioskillspopoverdescription3: ((
  inputs?: Studioskillspopoverdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioskillspopoverdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioskillspopoverdescription3 as "studioSkillsPopoverDescription" };
