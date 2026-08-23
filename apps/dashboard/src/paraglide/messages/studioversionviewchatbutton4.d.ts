export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionviewchatbutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "View chat message" |
 *
 * @param {Studioversionviewchatbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionviewchatbutton4: ((
  inputs?: Studioversionviewchatbutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionviewchatbutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionviewchatbutton4 as "studioVersionViewChatButton" };
