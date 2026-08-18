export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsbadgedraft2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Draft" |
 *
 * @param {Landingsbadgedraft2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsbadgedraft2: ((
  inputs?: Landingsbadgedraft2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsbadgedraft2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsbadgedraft2 as "landingsBadgeDraft" };
