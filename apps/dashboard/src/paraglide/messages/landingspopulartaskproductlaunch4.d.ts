export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingspopulartaskproductlaunch4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Launch a new product" |
 *
 * @param {Landingspopulartaskproductlaunch4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingspopulartaskproductlaunch4: ((
  inputs?: Landingspopulartaskproductlaunch4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingspopulartaskproductlaunch4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingspopulartaskproductlaunch4 as "landingsPopularTaskProductLaunch" };
