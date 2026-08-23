export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionoriginimport3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Imported" |
 *
 * @param {Studioversionoriginimport3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionoriginimport3: ((
  inputs?: Studioversionoriginimport3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionoriginimport3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionoriginimport3 as "studioVersionOriginImport" };
