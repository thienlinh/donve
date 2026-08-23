export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillsemptytitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "No skills yet" |
 *
 * @param {Skillsemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillsemptytitle2: ((
  inputs?: Skillsemptytitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillsemptytitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillsemptytitle2 as "skillsEmptyTitle" };
