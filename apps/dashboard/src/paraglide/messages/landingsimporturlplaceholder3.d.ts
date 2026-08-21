export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimporturlplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "https://example.com/landing-page" |
 *
 * @param {Landingsimporturlplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimporturlplaceholder3: ((
  inputs?: Landingsimporturlplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimporturlplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimporturlplaceholder3 as "landingsImportUrlPlaceholder" };
