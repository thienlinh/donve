export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellskillsnav2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Skills" |
 *
 * @param {Shellskillsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellskillsnav2: ((
  inputs?: Shellskillsnav2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellskillsnav2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellskillsnav2 as "shellSkillsNav" };
