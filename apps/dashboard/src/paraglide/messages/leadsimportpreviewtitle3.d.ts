export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportpreviewtitle3Inputs = {
  rows: NonNullable<unknown>;
  shown: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "{rows} rows parsed — showing the first {shown}" |
 *
 * @param {Leadsimportpreviewtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportpreviewtitle3: ((
  inputs: Leadsimportpreviewtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportpreviewtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportpreviewtitle3 as "leadsImportPreviewTitle" };
