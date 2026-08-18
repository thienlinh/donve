export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsnoresultstitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No landing pages match these filters" |
 *
 * @param {Landingsnoresultstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsnoresultstitle3: ((
  inputs?: Landingsnoresultstitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsnoresultstitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsnoresultstitle3 as "landingsNoResultsTitle" };
