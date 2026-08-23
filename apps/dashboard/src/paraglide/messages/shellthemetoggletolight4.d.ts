export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellthemetoggletolight4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Switch to light mode" |
 *
 * @param {Shellthemetoggletolight4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellthemetoggletolight4: ((
  inputs?: Shellthemetoggletolight4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellthemetoggletolight4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellthemetoggletolight4 as "shellThemeToggleToLight" };
