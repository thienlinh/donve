export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiocommentsenderrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't send the comment. Try again." |
 *
 * @param {Studiocommentsenderrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiocommentsenderrortoast4: ((
  inputs?: Studiocommentsenderrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiocommentsenderrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiocommentsenderrortoast4 as "studioCommentSendErrorToast" };
