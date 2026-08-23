export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimporttaburl3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paste link" |
 *
 * @param {Landingsimporttaburl3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimporttaburl3: ((
  inputs?: Landingsimporttaburl3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimporttaburl3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimporttaburl3 as "landingsImportTabUrl" };
