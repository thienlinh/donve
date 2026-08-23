export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodrawsendbutton3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Send" |
 *
 * @param {Studiodrawsendbutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodrawsendbutton3: ((
  inputs?: Studiodrawsendbutton3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodrawsendbutton3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodrawsendbutton3 as "studioDrawSendButton" };
