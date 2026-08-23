export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocomingsoon2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Coming soon" |
 *
 * @param {Studiocomingsoon2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocomingsoon2: ((
  inputs?: Studiocomingsoon2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocomingsoon2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocomingsoon2 as "studioComingSoon" };
