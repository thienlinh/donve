export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiogenerateerrorinsufficientcreditstitle5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Not enough credits" |
 *
 * @param {Studiogenerateerrorinsufficientcreditstitle5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiogenerateerrorinsufficientcreditstitle5: ((
  inputs?: Studiogenerateerrorinsufficientcreditstitle5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiogenerateerrorinsufficientcreditstitle5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiogenerateerrorinsufficientcreditstitle5 as "studioGenerateErrorInsufficientCreditsTitle" };
