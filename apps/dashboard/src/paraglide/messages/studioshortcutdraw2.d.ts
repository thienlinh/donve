export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioshortcutdraw2Inputs = {};
/**
 * | output |
 * | --- |
 * | "(D)" |
 *
 * @param {Studioshortcutdraw2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioshortcutdraw2: ((
  inputs?: Studioshortcutdraw2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioshortcutdraw2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioshortcutdraw2 as "studioShortcutDraw" };
