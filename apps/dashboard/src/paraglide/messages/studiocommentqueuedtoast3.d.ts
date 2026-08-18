export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentqueuedtoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Added to the comment queue" |
 *
 * @param {Studiocommentqueuedtoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentqueuedtoast3: ((
  inputs?: Studiocommentqueuedtoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentqueuedtoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentqueuedtoast3 as "studioCommentQueuedToast" };
