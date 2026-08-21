export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsusingbrandkit3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Using your Brand Kit" |
 *
 * @param {Landingsusingbrandkit3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsusingbrandkit3: ((
  inputs?: Landingsusingbrandkit3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsusingbrandkit3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsusingbrandkit3 as "landingsUsingBrandKit" };
