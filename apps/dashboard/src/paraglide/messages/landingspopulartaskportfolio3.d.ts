export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingspopulartaskportfolio3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Showcase a portfolio" |
 *
 * @param {Landingspopulartaskportfolio3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingspopulartaskportfolio3: ((
  inputs?: Landingspopulartaskportfolio3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingspopulartaskportfolio3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingspopulartaskportfolio3 as "landingsPopularTaskPortfolio" };
