export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimporttabfile3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Upload file" |
 *
 * @param {Landingsimporttabfile3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimporttabfile3: ((
  inputs?: Landingsimporttabfile3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimporttabfile3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimporttabfile3 as "landingsImportTabFile" };
