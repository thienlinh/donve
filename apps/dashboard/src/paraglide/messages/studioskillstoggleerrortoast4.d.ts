export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioskillstoggleerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't update this skill for this page. Try again." |
 *
 * @param {Studioskillstoggleerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioskillstoggleerrortoast4: ((
  inputs?: Studioskillstoggleerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioskillstoggleerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioskillstoggleerrortoast4 as "studioSkillsToggleErrorToast" };
