export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentsendallerrortoast5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't send the queued comments. Try again." |
 *
 * @param {Studiocommentsendallerrortoast5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentsendallerrortoast5: ((
  inputs?: Studiocommentsendallerrortoast5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentsendallerrortoast5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentsendallerrortoast5 as "studioCommentSendAllErrorToast" };
