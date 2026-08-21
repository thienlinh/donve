export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsleaddigestfrequencyhourly4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Every hour" |
 *
 * @param {Settingsleaddigestfrequencyhourly4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsleaddigestfrequencyhourly4: ((
  inputs?: Settingsleaddigestfrequencyhourly4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsleaddigestfrequencyhourly4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsleaddigestfrequencyhourly4 as "settingsLeadDigestFrequencyHourly" };
