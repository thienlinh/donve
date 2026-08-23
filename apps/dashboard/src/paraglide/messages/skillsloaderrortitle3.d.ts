export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillsloaderrortitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load skills" |
 *
 * @param {Skillsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillsloaderrortitle3: ((
  inputs?: Skillsloaderrortitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillsloaderrortitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillsloaderrortitle3 as "skillsLoadErrorTitle" };
