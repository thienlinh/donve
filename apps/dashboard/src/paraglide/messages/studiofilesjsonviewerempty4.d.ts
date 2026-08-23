export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesjsonviewerempty4Inputs = {};
/**
 * | output |
 * | --- |
 * | "No srcmap data yet." |
 *
 * @param {Studiofilesjsonviewerempty4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesjsonviewerempty4: ((
  inputs?: Studiofilesjsonviewerempty4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesjsonviewerempty4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesjsonviewerempty4 as "studioFilesJsonViewerEmpty" };
