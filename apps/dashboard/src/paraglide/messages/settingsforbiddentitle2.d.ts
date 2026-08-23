export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsforbiddentitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Only owners/admins can view organization settings" |
 *
 * @param {Settingsforbiddentitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsforbiddentitle2: ((
  inputs?: Settingsforbiddentitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsforbiddentitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsforbiddentitle2 as "settingsForbiddenTitle" };
