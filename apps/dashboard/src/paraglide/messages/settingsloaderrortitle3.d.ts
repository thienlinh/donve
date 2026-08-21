export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsloaderrortitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Failed to load settings" |
 *
 * @param {Settingsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsloaderrortitle3: ((
  inputs?: Settingsloaderrortitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsloaderrortitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsloaderrortitle3 as "settingsLoadErrorTitle" };
