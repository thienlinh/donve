export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillcreatedialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Create a skill" |
 *
 * @param {Skillcreatedialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillcreatedialogtitle3: ((
  inputs?: Skillcreatedialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillcreatedialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillcreatedialogtitle3 as "skillCreateDialogTitle" };
