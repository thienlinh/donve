export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentqueueempty3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No comments queued yet." |
 *
 * @param {Studiocommentqueueempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentqueueempty3: ((
  inputs?: Studiocommentqueueempty3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentqueueempty3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentqueueempty3 as "studioCommentQueueEmpty" };
