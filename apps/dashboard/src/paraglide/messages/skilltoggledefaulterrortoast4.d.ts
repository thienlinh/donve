export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skilltoggledefaulterrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't update the default setting for this skill. Try again." |
 *
 * @param {Skilltoggledefaulterrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skilltoggledefaulterrortoast4: ((
  inputs?: Skilltoggledefaulterrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skilltoggledefaulterrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skilltoggledefaulterrortoast4 as "skillToggleDefaultErrorToast" };
