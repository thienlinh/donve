export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentqueuetitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Queued comments" |
 *
 * @param {Studiocommentqueuetitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentqueuetitle3: ((
  inputs?: Studiocommentqueuetitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentqueuetitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentqueuetitle3 as "studioCommentQueueTitle" };
