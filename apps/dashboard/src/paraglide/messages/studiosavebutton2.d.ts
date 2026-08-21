export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiosavebutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Save" |
 *
 * @param {Studiosavebutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiosavebutton2: ((
  inputs?: Studiosavebutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiosavebutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiosavebutton2 as "studioSaveButton" };
