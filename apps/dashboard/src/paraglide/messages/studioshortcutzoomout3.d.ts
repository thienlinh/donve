export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioshortcutzoomout3Inputs = {};
/**
 * | output |
 * | --- |
 * | "(Cmd -)" |
 *
 * @param {Studioshortcutzoomout3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioshortcutzoomout3: ((
  inputs?: Studioshortcutzoomout3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioshortcutzoomout3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioshortcutzoomout3 as "studioShortcutZoomOut" };
