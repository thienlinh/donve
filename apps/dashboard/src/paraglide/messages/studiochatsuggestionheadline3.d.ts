export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiochatsuggestionheadline3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Rewrite the headline to be punchier" |
 *
 * @param {Studiochatsuggestionheadline3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiochatsuggestionheadline3: ((
  inputs?: Studiochatsuggestionheadline3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiochatsuggestionheadline3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiochatsuggestionheadline3 as "studioChatSuggestionHeadline" };
