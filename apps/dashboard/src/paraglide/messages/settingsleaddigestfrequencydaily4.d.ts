export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsleaddigestfrequencydaily4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Once a day" |
 *
 * @param {Settingsleaddigestfrequencydaily4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsleaddigestfrequencydaily4: ((
  inputs?: Settingsleaddigestfrequencydaily4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsleaddigestfrequencydaily4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsleaddigestfrequencydaily4 as "settingsLeadDigestFrequencyDaily" };
