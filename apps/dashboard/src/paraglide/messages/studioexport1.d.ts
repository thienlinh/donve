export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioexport1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Export" |
 *
 * @param {Studioexport1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioexport1: ((
  inputs?: Studioexport1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioexport1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioexport1 as "studioExport" };
