export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillremoveerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't remove this skill. Try again." |
 *
 * @param {Skillremoveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillremoveerrortoast3: ((
  inputs?: Skillremoveerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillremoveerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillremoveerrortoast3 as "skillRemoveErrorToast" };
