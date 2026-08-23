export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentsendtochatbutton5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Send to Chat" |
 *
 * @param {Studiocommentsendtochatbutton5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentsendtochatbutton5: ((
  inputs?: Studiocommentsendtochatbutton5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentsendtochatbutton5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentsendtochatbutton5 as "studioCommentSendToChatButton" };
