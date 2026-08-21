export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsdescription1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Organization-wide preferences." |
 *
 * @param {Settingsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsdescription1: ((
  inputs?: Settingsdescription1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsdescription1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsdescription1 as "settingsDescription" };
