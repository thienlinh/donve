export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentsenttoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Sent to chat" |
 *
 * @param {Studiocommentsenttoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentsenttoast3: ((
  inputs?: Studiocommentsenttoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentsenttoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentsenttoast3 as "studioCommentSentToast" };
