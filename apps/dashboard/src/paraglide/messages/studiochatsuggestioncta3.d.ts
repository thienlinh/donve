export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiochatsuggestioncta3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Make the CTA button stand out more" |
 *
 * @param {Studiochatsuggestioncta3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiochatsuggestioncta3: ((
  inputs?: Studiochatsuggestioncta3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiochatsuggestioncta3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiochatsuggestioncta3 as "studioChatSuggestionCta" };
