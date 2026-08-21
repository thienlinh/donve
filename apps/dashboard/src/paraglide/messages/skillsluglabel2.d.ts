export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillsluglabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Slug" |
 *
 * @param {Skillsluglabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillsluglabel2: ((
  inputs?: Skillsluglabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillsluglabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillsluglabel2 as "skillSlugLabel" };
