export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversioncomparebutton3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Compare selected" |
 *
 * @param {Studioversioncomparebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversioncomparebutton3: ((
  inputs?: Studioversioncomparebutton3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversioncomparebutton3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversioncomparebutton3 as "studioVersionCompareButton" };
