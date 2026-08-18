export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesjsonviewertitle4Inputs = {
  fileName: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "{fileName} — read-only" |
 *
 * @param {Studiofilesjsonviewertitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesjsonviewertitle4: ((
  inputs: Studiofilesjsonviewertitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesjsonviewertitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesjsonviewertitle4 as "studioFilesJsonViewerTitle" };
