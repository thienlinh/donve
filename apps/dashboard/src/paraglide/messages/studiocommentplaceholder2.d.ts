export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentplaceholder2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Describe the issue or suggestion..." |
 *
 * @param {Studiocommentplaceholder2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentplaceholder2: ((
  inputs?: Studiocommentplaceholder2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentplaceholder2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentplaceholder2 as "studioCommentPlaceholder" };
