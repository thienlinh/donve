export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsbrandkittitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Brand kit" |
 *
 * @param {Settingsbrandkittitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsbrandkittitle3: ((
  inputs?: Settingsbrandkittitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsbrandkittitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsbrandkittitle3 as "settingsBrandKitTitle" };
