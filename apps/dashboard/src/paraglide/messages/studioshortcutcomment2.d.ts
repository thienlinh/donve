export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioshortcutcomment2Inputs = {};
/**
 * | output |
 * | --- |
 * | "(C)" |
 *
 * @param {Studioshortcutcomment2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioshortcutcomment2: ((
  inputs?: Studioshortcutcomment2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioshortcutcomment2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioshortcutcomment2 as "studioShortcutComment" };
