export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionrestorebutton3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Restore" |
 *
 * @param {Studioversionrestorebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionrestorebutton3: ((
  inputs?: Studioversionrestorebutton3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionrestorebutton3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionrestorebutton3 as "studioVersionRestoreButton" };
