export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillsdescription1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Reusable instructions the AI applies when generating or patching landing pages." |
 *
 * @param {Skillsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillsdescription1: ((
  inputs?: Skillsdescription1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillsdescription1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillsdescription1 as "skillsDescription" };
