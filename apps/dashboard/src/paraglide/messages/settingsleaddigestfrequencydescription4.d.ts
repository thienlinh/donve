export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingsleaddigestfrequencydescription4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Batch new leads into one email per assignee/owner instead of sending one email per lead." |
 *
 * @param {Settingsleaddigestfrequencydescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingsleaddigestfrequencydescription4: ((
  inputs?: Settingsleaddigestfrequencydescription4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingsleaddigestfrequencydescription4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingsleaddigestfrequencydescription4 as "settingsLeadDigestFrequencyDescription" };
