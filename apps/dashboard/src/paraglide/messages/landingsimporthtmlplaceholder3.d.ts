export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimporthtmlplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paste the page's HTML…" |
 *
 * @param {Landingsimporthtmlplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimporthtmlplaceholder3: ((
  inputs?: Landingsimporthtmlplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimporthtmlplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimporthtmlplaceholder3 as "landingsImportHtmlPlaceholder" };
