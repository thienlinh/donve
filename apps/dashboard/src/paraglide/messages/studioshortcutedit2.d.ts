export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioshortcutedit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "(E)" |
 *
 * @param {Studioshortcutedit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioshortcutedit2: ((
  inputs?: Studioshortcutedit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioshortcutedit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioshortcutedit2 as "studioShortcutEdit" };
