export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimporterrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't import this page. Check the content/link and try again." |
 *
 * @param {Landingsimporterrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimporterrortoast3: ((
  inputs?: Landingsimporterrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimporterrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimporterrortoast3 as "landingsImportErrorToast" };
