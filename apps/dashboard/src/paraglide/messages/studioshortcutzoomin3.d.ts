export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioshortcutzoomin3Inputs = {};
/**
 * | output |
 * | --- |
 * | "(Cmd +)" |
 *
 * @param {Studioshortcutzoomin3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioshortcutzoomin3: ((
  inputs?: Studioshortcutzoomin3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioshortcutzoomin3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioshortcutzoomin3 as "studioShortcutZoomIn" };
