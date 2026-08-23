export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesthumbnailname3Inputs = {};
/**
 * | output |
 * | --- |
 * | ".thumbnail.jpg" |
 *
 * @param {Studiofilesthumbnailname3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesthumbnailname3: ((
  inputs?: Studiofilesthumbnailname3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesthumbnailname3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesthumbnailname3 as "studioFilesThumbnailName" };
