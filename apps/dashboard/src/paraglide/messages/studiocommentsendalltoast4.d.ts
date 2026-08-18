export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentsendalltoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Sent all comments to chat" |
 *
 * @param {Studiocommentsendalltoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentsendalltoast4: ((
  inputs?: Studiocommentsendalltoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentsendalltoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentsendalltoast4 as "studioCommentSendAllToast" };
