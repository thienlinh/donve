export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiosaveshortcuthint3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Save (⌘S)" |
 *
 * @param {Studiosaveshortcuthint3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiosaveshortcuthint3: ((
  inputs?: Studiosaveshortcuthint3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiosaveshortcuthint3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiosaveshortcuthint3 as "studioSaveShortcutHint" };
