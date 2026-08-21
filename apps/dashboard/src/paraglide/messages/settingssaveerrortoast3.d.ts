export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingssaveerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Failed to save settings" |
 *
 * @param {Settingssaveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingssaveerrortoast3: ((
  inputs?: Settingssaveerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingssaveerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingssaveerrortoast3 as "settingsSaveErrorToast" };
