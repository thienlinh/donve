export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioskillsemptytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No skills yet" |
 *
 * @param {Studioskillsemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioskillsemptytitle3: ((
  inputs?: Studioskillsemptytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioskillsemptytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioskillsemptytitle3 as "studioSkillsEmptyTitle" };
