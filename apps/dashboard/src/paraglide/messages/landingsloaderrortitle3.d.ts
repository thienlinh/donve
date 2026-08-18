export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsloaderrortitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load landing pages" |
 *
 * @param {Landingsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsloaderrortitle3: ((
  inputs?: Landingsloaderrortitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsloaderrortitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsloaderrortitle3 as "landingsLoadErrorTitle" };
