export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioskillsloaderrortitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load skills" |
 *
 * @param {Studioskillsloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioskillsloaderrortitle4: ((
  inputs?: Studioskillsloaderrortitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioskillsloaderrortitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioskillsloaderrortitle4 as "studioSkillsLoadErrorTitle" };
