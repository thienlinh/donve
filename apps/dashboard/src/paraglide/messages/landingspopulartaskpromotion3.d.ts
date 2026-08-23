export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingspopulartaskpromotion3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Run a promotion campaign" |
 *
 * @param {Landingspopulartaskpromotion3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingspopulartaskpromotion3: ((
  inputs?: Landingspopulartaskpromotion3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingspopulartaskpromotion3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingspopulartaskpromotion3 as "landingsPopularTaskPromotion" };
