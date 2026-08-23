export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentqueueerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't queue the comment. Try again." |
 *
 * @param {Studiocommentqueueerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentqueueerrortoast4: ((
  inputs?: Studiocommentqueueerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentqueueerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentqueueerrortoast4 as "studioCommentQueueErrorToast" };
