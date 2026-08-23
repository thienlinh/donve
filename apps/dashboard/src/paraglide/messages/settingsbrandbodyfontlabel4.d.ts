export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsbrandbodyfontlabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Body font" |
 *
 * @param {Settingsbrandbodyfontlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsbrandbodyfontlabel4: ((
  inputs?: Settingsbrandbodyfontlabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsbrandbodyfontlabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsbrandbodyfontlabel4 as "settingsBrandBodyFontLabel" };
