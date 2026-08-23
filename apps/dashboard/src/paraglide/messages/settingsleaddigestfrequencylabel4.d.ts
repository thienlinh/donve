export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsleaddigestfrequencylabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "New lead digest" |
 *
 * @param {Settingsleaddigestfrequencylabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsleaddigestfrequencylabel4: ((
  inputs?: Settingsleaddigestfrequencylabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsleaddigestfrequencylabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsleaddigestfrequencylabel4 as "settingsLeadDigestFrequencyLabel" };
