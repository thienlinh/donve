export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillsaveerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't save this skill. Try again." |
 *
 * @param {Skillsaveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillsaveerrortoast3: ((
  inputs?: Skillsaveerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillsaveerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillsaveerrortoast3 as "skillSaveErrorToast" };
