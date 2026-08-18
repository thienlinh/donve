export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingspopulartaskleadcapture4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Capture leads with a form" |
 *
 * @param {Landingspopulartaskleadcapture4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingspopulartaskleadcapture4: ((
  inputs?: Landingspopulartaskleadcapture4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingspopulartaskleadcapture4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingspopulartaskleadcapture4 as "landingsPopularTaskLeadCapture" };
