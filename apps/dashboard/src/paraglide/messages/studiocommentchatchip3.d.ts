export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentchatchip3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Commented on element" |
 *
 * @param {Studiocommentchatchip3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentchatchip3: ((
  inputs?: Studiocommentchatchip3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentchatchip3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentchatchip3 as "studioCommentChatChip" };
