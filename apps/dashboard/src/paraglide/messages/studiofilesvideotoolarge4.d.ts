export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesvideotoolarge4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Video is too large (max 50MB). Try a smaller file." |
 *
 * @param {Studiofilesvideotoolarge4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesvideotoolarge4: ((
  inputs?: Studiofilesvideotoolarge4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesvideotoolarge4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesvideotoolarge4 as "studioFilesVideoTooLarge" };
