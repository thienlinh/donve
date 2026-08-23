export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkexport2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Export CSV" |
 *
 * @param {Leadsbulkexport2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkexport2: ((
  inputs?: Leadsbulkexport2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkexport2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkexport2 as "leadsBulkExport" };
