export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentqueuebutton3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Queue" |
 *
 * @param {Studiocommentqueuebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentqueuebutton3: ((
  inputs?: Studiocommentqueuebutton3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentqueuebutton3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentqueuebutton3 as "studioCommentQueueButton" };
