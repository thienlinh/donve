export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentsendallbutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Send all" |
 *
 * @param {Studiocommentsendallbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentsendallbutton4: ((
  inputs?: Studiocommentsendallbutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentsendallbutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentsendallbutton4 as "studioCommentSendAllButton" };
