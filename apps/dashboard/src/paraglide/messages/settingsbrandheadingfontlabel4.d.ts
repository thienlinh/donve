export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsbrandheadingfontlabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Heading font" |
 *
 * @param {Settingsbrandheadingfontlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsbrandheadingfontlabel4: ((
  inputs?: Settingsbrandheadingfontlabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsbrandheadingfontlabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsbrandheadingfontlabel4 as "settingsBrandHeadingFontLabel" };
