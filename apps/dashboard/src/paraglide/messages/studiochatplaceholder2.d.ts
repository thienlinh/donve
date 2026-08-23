export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiochatplaceholder2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Ask AI to edit this page..." |
 *
 * @param {Studiochatplaceholder2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiochatplaceholder2: ((
  inputs?: Studiochatplaceholder2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiochatplaceholder2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiochatplaceholder2 as "studioChatPlaceholder" };
