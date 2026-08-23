export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsfilterpublished2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Published" |
 *
 * @param {Landingsfilterpublished2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsfilterpublished2: ((
  inputs?: Landingsfilterpublished2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsfilterpublished2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsfilterpublished2 as "landingsFilterPublished" };
