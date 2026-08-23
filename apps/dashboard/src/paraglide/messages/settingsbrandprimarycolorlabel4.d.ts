export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsbrandprimarycolorlabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Primary color" |
 *
 * @param {Settingsbrandprimarycolorlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsbrandprimarycolorlabel4: ((
  inputs?: Settingsbrandprimarycolorlabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsbrandprimarycolorlabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsbrandprimarycolorlabel4 as "settingsBrandPrimaryColorLabel" };
