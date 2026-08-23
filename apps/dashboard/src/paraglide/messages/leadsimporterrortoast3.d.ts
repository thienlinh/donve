export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimporterrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't import this file. Try again." |
 *
 * @param {Leadsimporterrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimporterrortoast3: ((
  inputs?: Leadsimporterrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimporterrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimporterrortoast3 as "leadsImportErrorToast" };
