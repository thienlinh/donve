export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionlabelbutton3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Label" |
 *
 * @param {Studioversionlabelbutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionlabelbutton3: ((
  inputs?: Studioversionlabelbutton3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionlabelbutton3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionlabelbutton3 as "studioVersionLabelButton" };
