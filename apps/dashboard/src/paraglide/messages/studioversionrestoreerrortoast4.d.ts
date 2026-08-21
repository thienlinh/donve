export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionrestoreerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't restore this version. Try again." |
 *
 * @param {Studioversionrestoreerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionrestoreerrortoast4: ((
  inputs?: Studioversionrestoreerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionrestoreerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionrestoreerrortoast4 as "studioVersionRestoreErrorToast" };
