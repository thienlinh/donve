export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsbadgepublished2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Published" |
 *
 * @param {Landingsbadgepublished2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsbadgepublished2: ((
  inputs?: Landingsbadgepublished2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsbadgepublished2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsbadgepublished2 as "landingsBadgePublished" };
