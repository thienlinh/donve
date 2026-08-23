export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentattachlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Attach file" |
 *
 * @param {Studiocommentattachlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentattachlabel3: ((
  inputs?: Studiocommentattachlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentattachlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentattachlabel3 as "studioCommentAttachLabel" };
