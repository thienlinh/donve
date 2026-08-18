export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiochatsuggestionmobile3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Improve the layout for mobile" |
 *
 * @param {Studiochatsuggestionmobile3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiochatsuggestionmobile3: ((
  inputs?: Studiochatsuggestionmobile3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiochatsuggestionmobile3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiochatsuggestionmobile3 as "studioChatSuggestionMobile" };
