export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsexporterrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Failed to export CSV. Try again." |
 *
 * @param {Leadsexporterrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsexporterrortoast3: ((
  inputs?: Leadsexporterrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsexporterrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsexporterrortoast3 as "leadsExportErrorToast" };
