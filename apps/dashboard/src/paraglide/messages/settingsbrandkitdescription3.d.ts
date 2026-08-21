export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsbrandkitdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Your colors and fonts, applied automatically to every AI-generated landing page." |
 *
 * @param {Settingsbrandkitdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsbrandkitdescription3: ((
  inputs?: Settingsbrandkitdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsbrandkitdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsbrandkitdescription3 as "settingsBrandKitDescription" };
